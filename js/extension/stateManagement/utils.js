import { localizedLayerStylesEnvSelector } from "@mapstore/selectors/localizedLayerStyles";
import { buildIdentifyRequest } from "@mapstore/utils/MapInfoUtils";
import { identifyOptionsSelector } from "@mapstore/selectors/mapInfo";

export function layerRequest({ latlng }, layer, state) {
    let env = localizedLayerStylesEnvSelector(state);
    const identifyOptionsInfos = {
        ...identifyOptionsSelector(state),
        point: { latlng },
    };
    let { url, request } = buildIdentifyRequest(layer, {
        ...identifyOptionsInfos,
        env,
    });
    request.info_format = "application/json";
    return { url, request, layer, name: layer.name };
}
