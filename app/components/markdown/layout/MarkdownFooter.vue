<template>
  <div class="fixed inset-x-0 bottom-1 z-40 pointer-events-none">
    <div class="w-full pointer-events-auto px-4">
        <div class="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm h-10 px-3">
          <div class="flex items-center gap-4 text-xs text-gray-600 cursor-pointer" @click="$emit('word-count')" title="Click to view detailed word count statistics">
            <span class="font-medium">Words</span>
            <span class="text-gray-800">{{ wordCount }}</span>
          </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(-25)" title="Zoom out (decrease by 25%)"><Minus class="w-4 h-4" /></Button>
          <Popover>
            <PopoverTrigger as-child>
              <div>
                <Input type="number" v-model="zoomModel" class="w-16 text-center h-8" title="Current zoom level - click to set custom zoom" />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-32 p-2">
              <div class="flex flex-col">
                <button class="text-left px-2 py-1 rounded hover:bg-gray-100 font-medium" @click="selectZoom('fit')">Fit</button>
                <div class="border-t my-1" />
                <button v-for="opt in zoomOptions" :key="opt" class="text-left px-2 py-1 rounded hover:bg-gray-100" @click="selectZoom(opt)">{{ opt }}%</button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(25)" title="Zoom in (increase by 25%)"><Plus class="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps<{ wordCount:number; zoom?:number; fitMode?:boolean }>()
const emit = defineEmits(['set-zoom','word-count'])

const zoomPercent = ref(props.zoom ?? 100)
const isFit = ref(!!props.fitMode)
watch(()=>props.zoom, v=>{ if(typeof v==='number'){ zoomPercent.value = Math.round(v) } })
watch(()=>props.fitMode, v=>{ isFit.value = !!v })

const zoomModel = computed<string | number>({
  get: ()=> isFit.value? 100: zoomPercent.value,
  set: (v)=>{ const n = Number(v); if(Number.isNaN(n)) return; isFit.value=false; zoomPercent.value = Math.min(200, Math.max(50, Math.round(n))); emit('set-zoom', zoomPercent.value) }
})
const zoomOptions=[50,75,100,125,150,175,200]
function changeZoom(delta:number){ zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta)); isFit.value=false; emit('set-zoom', zoomPercent.value) }
function selectZoom(opt:number|'fit'){ if(opt==='fit'){ emit('set-zoom','fit'); return } zoomPercent.value = opt as number; isFit.value=false; emit('set-zoom', opt as number) }
</script>
