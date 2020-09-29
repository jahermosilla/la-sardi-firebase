import interact from 'interactjs';

const noop = () => {};

export default {
    inserted: createOrUpdate,

    update: createOrUpdate,

    unbind(el) {
        interact(el).unset();
    }
}

function createOrUpdate(el, bindings) {
    const {
        onstart = noop,
        onmove = noop,
        onend = noop,
        startAxis = 'xy',
        inertia = false,
        enabled = true
    } = bindings.value;

    interact(el).unset();

    interact(el).draggable({
        startAxis,
        inertia,
        enabled,
        onstart,
        onmove,
        onend
    });
}