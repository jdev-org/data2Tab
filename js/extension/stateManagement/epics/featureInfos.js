import * as Rx from "rxjs";
import { isEmpty } from "lodash";
// mapstore actions

import { localizedLayerStylesEnvSelector } from "@mapstore/selectors/localizedLayerStyles";
import { buildIdentifyRequest } from "@mapstore/utils/MapInfoUtils";
import { identifyOptionsSelector } from "@mapstore/selectors/mapInfo";
import { layersSelector } from "@mapstore/selectors/layers";

import { CLICK_ON_MAP } from "@mapstore/actions/map";

import { layerRequest } from "../utils";

import {
    getAuthLevel,
    getLayers,
    getPluginCfg,
    isActive,
} from "../selector/selector";
import {
    displayMsg,
    setFeature,
    setLayer,
    setResponse,
} from "../actions/actions";
import { getFeatureInfo } from "@mapstore/api/identify";

// plugin action

// epics
export const clickMap1 = (action$, store) => {
    return action$
        .ofType(CLICK_ON_MAP)
        .filter(
            () => isActive(store.getState()) && getAuthLevel(store.getState())
        )
        .switchMap((action) => {
            let latlng = action.point.latlng;
            let tocLayer = layersSelector(store.getState()).filter(
                (lyr) =>
                    lyr.name === getPluginCfg(store.getState()).layer &&
                    lyr.visibility
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

export const clickMap2 = (action$, store) => {
    return action$
        .ofType(CLICK_ON_MAP)
        .filter(
            () => isActive(store.getState()) && getAuthLevel(store.getState())
        )
        .switchMap((action) => {
            let latlng = action.point.latlng;
            let state = store.getState();
            let tocLayer = layersSelector(state);
            tocLayer = tocLayer.filter((lyr) => {
                return getLayers(state).includes(lyr.name);
            })[0];

            let layersFromCfg = getLayers(state);
            let req = [
                layersFromCfg.map((layer) => {
                    layersSelector(state).filter((lyr) => {
                        return layer == lyr.name;
                    })[0];
                }),
            ];
            let gfiRequest = layerRequest(
                action.point,
                tocLayer,
                store.getState()
            );
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
                        setResponse(response),
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

export const clickMap = (action$, store) => {
    return action$
        .ofType(CLICK_ON_MAP)
        .filter(
            () => isActive(store.getState()) && getAuthLevel(store.getState())
        )
        .switchMap((action) => {
            let latlng = action.point.latlng;
            let state = store.getState();

            let layersFromCfg = getLayers(state);
            let tocLayers = layersSelector(state);
            let requestLayers = tocLayers.filter(
                (layer) =>
                    layersFromCfg.includes(layer.name) && layer.visibility
            );
            let requestsInfos = requestLayers.map((tocLayer) =>
                layerRequest(action.point, tocLayer, store.getState())
            );
            // else get feature infos
            return Rx.Observable.from(requestsInfos)
                .map((r) =>
                    Rx.Observable.defer(() =>
                        getFeatureInfo(r.url, r.request, r.layer, {})
                    )
                )
                .toArray()
                .switchMap((requestArray, i) => {
                    return Rx.Observable.forkJoin(requestArray).flatMap(
                        (elementArray) => {
                            let featuresByConfigLayer = requestsInfos.map(
                                (x, i) => [x.name, elementArray[i]?.features]
                            );
                            featuresByConfigLayer =
                                featuresByConfigLayer.filter(
                                    (x) => x[1].length
                                );
                            return Rx.Observable.of(
                                setResponse(
                                    isEmpty(featuresByConfigLayer)
                                        ? []
                                        : featuresByConfigLayer
                                ),
                                setLayer(
                                    isEmpty(featuresByConfigLayer)
                                        ? ""
                                        : { label: featuresByConfigLayer[0][0] }
                                )
                            );
                        }
                    );
                });
        });
};
