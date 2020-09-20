<template>
  <div :style="style" @dragstart="dragStart" @dragend="dragEnd"></div>
</template>

<script>
import deckPath from '@/assets/deck.png';

const CARD_WIDTH = 208;
const CARD_HEIGHT = 319;

const TARGET_WIDTH = 100;
const TARGET_HEIGHT = TARGET_WIDTH * CARD_HEIGHT / CARD_WIDTH;


export default {
    props: {
        color: {
            required: true,
            type: String
        },

        val: {
            required: true,
            type: Number,
            check(n) {
                return n > 0 && n < 13;
            }
        },

        disabled: {
            type: Boolean,
            default() {
                return true;
            }
        },

        noPointer: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },

    methods: {
        dragStart() {
            this.opacity = 0.5;
        },

        dragEnd() {
            this.opacity = 1;
        }
    },

    data() {
        return {
            opacity: 1,
        }
    },

    computed: {

        position() {
            const dx = this.val - 1;
            const dy = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS', 'NONE'].reverse().indexOf(this.color);

            const w = (TARGET_WIDTH * 12) - (TARGET_WIDTH * dx);
            const h = (TARGET_HEIGHT * dy) + TARGET_HEIGHT;

            return `${w}px ${h}px`;
        },

        style() {
            return {
                width: `${TARGET_WIDTH}px`,
                height: `${TARGET_HEIGHT}px`,
                background: `url('${deckPath}') 0px 0px`,
                backgroundPosition: this.position,
                backgroundSize: `${TARGET_WIDTH * 12}px ${TARGET_HEIGHT * 5}px`,
                //transform: 'scale(0.5)',
                //position: 'absolute',
                cursor: this.disabled || this.noPointer ? 'auto' : 'pointer',
                opacity: this.disabled ? 0.5 : this.opacity
            }
        }
    }
}
</script>

<style>

</style>