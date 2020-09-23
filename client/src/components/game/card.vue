<template>
  <div @resize="onResize" :style="style" @dragstart="dragStart" @dragend="dragEnd">
    <slot />
  </div>
</template>

<script>
import deckPath from '@/assets/deck.png';

const CARD_WIDTH = 208;
const CARD_HEIGHT = 319;


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
        },

        onResize() {
            this.targetWidth = (window.innerHeight * 0.20) * CARD_WIDTH / CARD_HEIGHT;
            this.targetHeight = window.innerHeight * 0.20;

            console.log(window.innerHeight)
        }
    },

    data() {
        return {
            opacity: 1,
            targetWidth: (window.innerHeight * 0.20) * CARD_WIDTH / CARD_HEIGHT,
            targetHeight: window.innerHeight * 0.20
        }
    },

    computed: {

        position() {
            const dx = this.val - 1;
            const dy = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS', 'NONE'].reverse().indexOf(this.color);

            const w = (this.targetWidth * 12) - (this.targetWidth * dx);
            const h = (this.targetHeight * dy) + this.targetHeight;

            return `${w}px ${h}px`;
        },

        style() {
            return {
                width: `${this.targetWidth}px`,
                height: `${this.targetHeight}px`,
                background: `url('${deckPath}') 0px 0px`,
                backgroundPosition: this.position,
                backgroundSize: `${this.targetWidth * 12}px ${this.targetHeight * 5}px`,
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