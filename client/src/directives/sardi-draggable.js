import interact from 'interactjs';
import { isEqual, pick } from 'lodash';

const noop = () => {};

const observableProperties = [
    'startAxis',
    'inertia',
    'restrict',
    'enabled',
    'autoScroll',
];

export default {
    inserted,
    update,
    unbind
}

function unbind(el) {
    interact(el).unset();
}

function update(el, bindings) {
    if (
        isEqual(
            pick(bindings.value, observableProperties), 
            pick(bindings.oldValue, observableProperties)
        )
    ) {
        return;
    }
    
    unbind(el);
    inserted(el, bindings);
}

function inserted(el, bindings) {
    const {
        onstart = noop,
        onmove = noop,
        onend = noop,
        startAxis = 'xy',
        inertia = false,
        restrict = null,
        enabled = true,
        autoScroll = false
    } = bindings.value;
    
    interact(el).draggable({
        startAxis,
        inertia,
        restrict,
        autoScroll,
        enabled,
        onstart,
        onmove,
        onend
    });
}