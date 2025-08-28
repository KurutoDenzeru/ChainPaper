<template>
  <div class="flex items-center flex-wrap gap-1 px-3 py-1 rounded-lg bg-white border border-gray-200 shadow-sm">
    <!-- Undo / Redo -->
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :disabled="!canUndo" @click="emit('undo')">
      <Undo2 class="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :disabled="!canRedo" @click="emit('redo')">
      <Redo2 class="w-4 h-4" />
    </Button>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Bold / Italic / Underline / Strikethrough -->
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.bold }" @click="emit('format-bold')">
      <Bold class="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.italic }" @click="emit('format-italic')">
      <Italic class="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.underline }" @click="emit('format-underline')">
      <Underline class="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.strike }" @click="emit('format-strikethrough')">
      <Strikethrough class="w-4 h-4" />
    </Button>

    <!-- Text Color -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
          <div class="relative flex items-center justify-center">
            <Type class="w-4 h-4" />
            <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentTextColor }"></div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-56 p-3">
        <div class="grid grid-cols-8 gap-1">
          <button v-for="c in textColors" :key="c" class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform" :style="{ backgroundColor: c }" @click="emit('set-text-color', c)"></button>
        </div>
      </PopoverContent>
    </Popover>

    <!-- Highlight -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
          <div class="relative flex items-center justify-center">
            <Highlighter class="w-4 h-4" />
            <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: currentHighlight }"></div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-56 p-3">
        <div class="grid grid-cols-8 gap-1">
          <button v-for="c in highlightColors" :key="c" class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform" :style="{ backgroundColor: c }" @click="emit('set-highlight', c)"></button>
        </div>
      </PopoverContent>
    </Popover>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Headings -->
    <Select v-model="heading" @update:modelValue="onHeadingChange">
      <SelectTrigger class="w-28 h-8">
        <SelectValue placeholder="Paragraph" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="p">Paragraph</SelectItem>
        <SelectItem value="h1">Heading 1</SelectItem>
        <SelectItem value="h2">Heading 2</SelectItem>
        <SelectItem value="h3">Heading 3</SelectItem>
        <SelectItem value="h4">Heading 4</SelectItem>
        <SelectItem value="h5">Heading 5</SelectItem>
        <SelectItem value="h6">Heading 6</SelectItem>
      </SelectContent>
    </Select>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Lists -->
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.bullet }" @click="emit('toggle-bullet-list')">
      <List class="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" :class="{ 'bg-gray-100': active.ordered }" @click="emit('toggle-ordered-list')">
      <ListOrdered class="w-4 h-4" />
    </Button>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Alignment -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
          <component :is="alignmentIcon" class="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-36 p-2">
        <div class="flex flex-col">
          <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('left')"><AlignLeft class="w-4 h-4" />Left</button>
          <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('center')"><AlignCenter class="w-4 h-4" />Center</button>
          <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('right')"><AlignRight class="w-4 h-4" />Right</button>
          <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlign('justify')"><AlignJustify class="w-4 h-4" />Justify</button>
        </div>
      </PopoverContent>
    </Popover>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Insert link / image / table / code -->
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="emit('insert-link')"><Link class="w-4 h-4" /></Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="emit('insert-image')"><ImageIcon class="w-4 h-4" /></Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="emit('insert-code-block')"><Code2 class="w-4 h-4" /></Button>
    <TableInserter @insert-table="(r,c,h)=>emit('insert-table',r,c,h)">
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0"><Table class="w-4 h-4" /></Button>
    </TableInserter>

    <!-- Mode toggle -->
    <Button variant="ghost" size="sm" class="h-8 px-2" @click="toggleMode" :title="mode==='source' ? 'Switch to Reader' : 'Switch to Source'">
      <span class="text-xs font-medium">{{ mode==='source' ? 'Reader' : 'Source' }}</span>
    </Button>

    <div class="h-6 w-px bg-gray-300 mx-1"></div>

    <!-- Zoom -->
    <div class="flex items-center gap-1">
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(-25)"><Minus class="w-4 h-4" /></Button>
      <Popover>
        <PopoverTrigger as-child>
          <div>
            <Input type="number" v-model="zoomModel" class="w-20 text-center h-8 rounded" />
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
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(25)"><Plus class="w-4 h-4" /></Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import TableInserter from '@/components/editor/TableInserter.vue'
import { Bold, Italic, Underline, Strikethrough, Type, Highlighter, Undo2, Redo2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image as ImageIcon, Code2, Table, Minus, Plus } from 'lucide-vue-next'

interface ActiveState { bold:boolean; italic:boolean; underline:boolean; strike:boolean; bullet:boolean; ordered:boolean }
const props = defineProps<{ active?: Partial<ActiveState>; align?: string; zoom?: number; fitMode?: boolean; canUndo?: boolean; canRedo?: boolean; textColor?: string; highlight?: string; mode?: 'source' | 'reader' }>()
const emit = defineEmits(['format-bold','format-italic','format-underline','format-strikethrough','toggle-bullet-list','toggle-ordered-list','insert-link','insert-image','insert-table','insert-code-block','set-heading','set-alignment','undo','redo','set-zoom','set-text-color','set-highlight','update:mode'])

const heading = ref('p')
function onHeadingChange(v: unknown){
  if (v == null) return
  const val = String(v)
  heading.value = val
  if (val==='p') emit('set-heading',0)
  else emit('set-heading', Number(val.replace('h','')) )
}

function setAlign(a: string){ emit('set-alignment', a) }
const alignmentIcon = computed(()=> props.align==='center'? AlignCenter : props.align==='right'? AlignRight : props.align==='justify'? AlignJustify : AlignLeft )

const active = computed(()=> ({ bold: !!props.active?.bold, italic: !!props.active?.italic, underline: !!props.active?.underline, strike: !!props.active?.strike, bullet: !!props.active?.bullet, ordered: !!props.active?.ordered }))

const textColors = ['#111827','#374151','#6B7280','#9CA3AF','#DC2626','#EA580C','#D97706','#CA8A04','#16A34A','#0D9488','#2563EB','#9333EA','#DB2777','#F59E0B','#10B981','#3B82F6','#6366F1']
const highlightColors = ['#FEF3C7','#FFEDD5','#FFE4E6','#F3E8FF','#E0F2FE','#DCFCE7','#FEE2E2','#E2E8F0','#D1FAE5','#FDE68A','#FBCFE8','#C7D2FE','#E9D5FF','#F5F3FF','#FAE8FF','#F1F5F9']
const currentTextColor = computed(()=> props.textColor || '#111827')
const currentHighlight = computed(()=> props.highlight || '#FDE68A')

// zoom logic
const zoomPercent = ref<number>(props.zoom ?? 100)
const isFit = ref<boolean>(!!props.fitMode)
watch(()=>props.zoom, v=>{ if(typeof v==='number'){ isFit.value=false; zoomPercent.value = Math.round(v) } })
watch(()=>props.fitMode, v=>{ isFit.value = !!v })

const zoomModel = computed<string | number>({
  get: ()=> isFit.value ? 100 : zoomPercent.value,
  set: (v)=>{ const n = Number(v); if(Number.isNaN(n)) return; isFit.value=false; zoomPercent.value = Math.min(200, Math.max(50, Math.round(n))); emit('set-zoom', zoomPercent.value) }
})
const zoomOptions = [50,75,100,125,150,175,200]
function changeZoom(delta:number){ zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta)); isFit.value=false; emit('set-zoom', zoomPercent.value) }
function selectZoom(opt:number | 'fit'){ if(opt==='fit'){ emit('set-zoom','fit'); return } zoomPercent.value = opt as number; isFit.value=false; emit('set-zoom', opt as number) }

const canUndo = computed(()=> !!props.canUndo)
const canRedo = computed(()=> !!props.canRedo)
const mode = ref<'source' | 'reader'>(props.mode ?? 'source')
watch(()=>props.mode, v=>{ if(v) mode.value = v })
function toggleMode(){ mode.value = mode.value==='source' ? 'reader' : 'source'; emit('update:mode', mode.value) }
</script>
