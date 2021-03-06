<template>
        <!-- :style="{ transform: moveCardStyle, position: isMoving ? 'fixed' : 'initial' }" -->
      <div class="game-card" :data-app="dataApp">
        <div class="card-front" :style="style">
            <vue-global-events target="window" @resize="onResize"></vue-global-events>
        </div>

        <div v-if="withBack" class="card-back" :style="styleBack"></div>
      </div>
</template>

<script>
import deckPath from '@/assets/deck.png';
import VueGlobalEvents from 'vue-global-events';
import { COLORS_WITH_NONE } from "@/constants";

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

        value: {
            required: true,
            type: Number,
            check(n) {
                return n > 0 && n < 13;
            }
        },

        disabled: {
            type: Boolean,
            default() {
                return false;
            }
        },

        withBack: {
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
        },

        draggable: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },

    methods: {
        onResize() {
            this.targetWidth = (window.innerHeight * 0.20) * CARD_WIDTH / CARD_HEIGHT;
            this.targetHeight = window.innerHeight * 0.20;
        }
    },

    data() {
        return {
            opacity: 1,
            targetWidth: (window.innerHeight * 0.20) * CARD_WIDTH / CARD_HEIGHT,
            targetHeight: window.innerHeight * 0.20,
            isMoving: false,
            moveCardPosition: {
                x: 0,
                y: 0
            }
        }
    },
    
    computed: {
        dataApp() {
            return JSON.stringify(this.$props);
        },

        positionBack() {
            const dx = 1;
            const dy = COLORS_WITH_NONE.slice().reverse().indexOf('NONE');

            const w = (this.targetWidth * 12) - (this.targetWidth * dx);
            const h = (this.targetHeight * dy) + this.targetHeight;

            return `${w}px ${h}px`;            
        },

        position() {
            const dx = this.value - 1;
            const dy = COLORS_WITH_NONE.slice().reverse().indexOf(this.color);

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
    transition: opacity 0.35s ease-in-out;
    touch-action: none;
    user-select: none;
}

.card-front, .card-back {
    transition: opacity 0.35s ease-in-out;
}

.card-flipped .game-card {
    transform: rotateY(180deg) !important;
}

.card-flipped .card-back {
    transform: rotateY(0deg) !important;
}
</style>