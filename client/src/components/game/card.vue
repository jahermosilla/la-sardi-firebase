<template>
  <transition name="slide-x-transition">
      <div @dragstart="dragStart" @dragend="dragEnd" class="game-card">
        <div :style="style">
            <vue-global-events target="window" @resize="onResize"></vue-global-events>
        </div>

        <div class="card-back" :style="styleBack"></div>
      </div>
  </transition>
</template>

<script>
import deckPath from '@/assets/deck.png';
import VueGlobalEvents from 'vue-global-events';

const CARD_WIDTH = 208;
const CARD_HEIGHT = 319;


export default {
    components: {
        VueGlobalEvents
    },

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
        positionBack() {
            const dx = 1;
            const dy = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS', 'NONE'].reverse().indexOf('NONE');

            const w = (this.targetWidth * 12) - (this.targetWidth * dx);
            const h = (this.targetHeight * dy) + this.targetHeight;

            return `${w}px ${h}px`;            
        },

        position() {
            const dx = this.val - 1;
            const dy = ['OROS', 'COPAS', 'ESPADAS', 'BASTOS', 'NONE'].reverse().indexOf(this.color);

            const w = (this.targetWidth * 12) - (this.targetWidth * dx);
            const h = (this.targetHeight * dy) + this.targetHeight;

            return `${w}px ${h}px`;
        },

        styleBack() {
            return {
                ...this.style,
                backgroundPosition: this.positionBack,
                position: 'absolute',
                top: '0px',
                left: '0px',
                transform: 'rotateY(180deg)',
                opacity: 1
            }
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
                opacity: this.disabled ? 0.5 : this.opacity,
                backfaceVisibility: 'hidden'
            }
        }
    }
}
</script>

<style>
.game-card {
    position: relative;
    transition: transform 0.2s ease-in-out;
}

.flipped .game-card {
    transform: rotateY(180deg) !important;
}

.flipped .card-back {
    transform: rotateY(0deg) !important;
}
</style>