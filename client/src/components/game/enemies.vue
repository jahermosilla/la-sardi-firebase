<template>
    <v-container fluid class="py-0">
        <v-row justify="space-between">
            <v-col class="d-flex child-flex" v-for="enemy in enemies" :key="enemy.uid" :cols="3" :sm="2" :lg="1">
                <enemy v-bind="enemy"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Enemy from '@/components/game/enemy';

export default {
    props: {
        enemies: {
            type: Array,
            required: true
        }
    },

    components: {
        Enemy
    }
}
</script>