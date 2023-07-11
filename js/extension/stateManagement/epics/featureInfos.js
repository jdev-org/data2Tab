import * as Rx from "rxjs";
import { isEmpty } from "lodash";
// mapstore actions

import { localizedLayerStylesEnvSelector } from "@mapstore/selectors/localizedLayerStyles";
import { buildIdentifyRequest } from "@mapstore/utils/MapInfoUtils";
import { identifyOptionsSelector } from "@mapstore/selectors/mapInfo";
import { layersSelector } from "@mapstore/selectors/layers";

import { CLICK_ON_MAP } from "@mapstore/actions/map";

import { getAuthLevel, getPluginCfg, isActive } from "../selector/selector";
import { displayMsg, setFeature } from "../actions/actions";
import { getFeatureInfo } from "@mapstore/api/identify";

// plugin action

// epics
export const clickMap = (action$, store) => {
    return action$
        .ofType(CLICK_ON_MAP)
        .filter(
            () => isActive(store.getState()) && getAuthLevel(store.getState())
        )
        .switchMap((action) => {
            let latlng = action.point.latlng;
            let tocLayer = layersSelector(store.getState()).filter(
                (lyr) => lyr.name === getPluginCfg(store.getState()).layer
            )[0];
            // no d2t layers to click
            let env = localizedLayerStylesEnvSelector(store.getState());
            const identifyOptionsInfos = {
                ...identifyOptionsSelector(store.getState()),
                point: { latlng },
            };
            let { url, request } = buildIdentifyRequest(tocLayer, {
                ...identifyOptionsInfos,
                env,
            });
            request.info_format = "application/json";
            // else get feature infos
            return Rx.Observable.defer(() =>
                getFeatureInfo(url, request, tocLayer, {})
            )
                .catch(() => {
                    // todo : use common alert component
                    displayMsg("error", "Incident", "La requête a échouée !");
                    return Rx.Observable.of({});
                })
                .switchMap((response) => {
                    if (isEmpty(response) || isEmpty(response.features)) {
                        return Rx.Observable.of(
                            setFeature(null),
                            displayMsg("info", "Recherche", "Aucun résultat !")
                        );
                    }
                    return Rx.Observable.of(
                        setFeature(response.features[0]),
                        displayMsg(
                            "success",
                            "Recherche",
                            "Un résultat à été trouvé !"
                        )
                    );
                });
        });
};
