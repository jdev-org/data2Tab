import {connect} from "react-redux";
import { name } from '../../../config';
import { toggleControl } from "@mapstore/actions/controls";

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import ExtensionComponent from "../components/Component";
import Rx from "rxjs";
import {Glyphicon} from 'react-bootstrap';

import { CONTROL_NAME } from "../constants";

import { changeZoomLevel } from "@mapstore/actions/map";
import '../assets/style.css';

import drop from "../assets/drop.svg"

export default createPlugin(name, {
    component: connect(state => ({
        value: state.d2t && state.d2t.value
    }), {
        onIncrease: () => {
            return {
                type: 'INCREASE_COUNTER'
            };
        }, changeZoomLevel
    })(ExtensionComponent),
    reducers: {
        d2t: (state = { value: 1 }, action) => {
            if (action.type === 'INCREASE_COUNTER') {
                return { value: state.value + 1 };
            }
            return state;
        }
    },
    epics: {
        logCounterValue: (action$, store) => action$.ofType('INCREASE_COUNTER').switchMap(() => {
            /* eslint-disable */
            console.log('CURRENT VALUE: ' + store.getState().d2t.value);
            /* eslint-enable */
            return Rx.Observable.empty();
        })
    },
    containers: {
        SidebarMenu: {
            name: CONTROL_NAME,
            position: 10,
            // icon: <img src={drop} />,
            glyph: "wrench", 
            tooltip: "d2t.tooltip",
            doNotHide: true,
            alwaysVisible: true,
            text: <Message msgId="d2t.title"/>,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            priority: 1
        }
    }
});
