<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out"
      :class="{
        'translate-y-0 opacity-100': isVisible,
        'translate-y-8 opacity-0': !isVisible,
        'bg-green-50 border-green-500': type === 'success',
        'bg-red-50 border-red-500': type === 'error',
        'bg-blue-50 border-blue-500': type === 'info'
      }"
    >
      <div class="p-4 rounded-lg shadow-lg border-l-4 flex items-start">
        <div class="flex-shrink-0 mr-3">
          <CheckCircle v-if="type === 'success'" class="w-5 h-5 text-green-500" />
          <XCircle v-else-if="type === 'error'" class="w-5 h-5 text-red-500" />
          <InfoIcon v-else class="w-5 h-5 text-blue-500" />
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium" :class="{
            'text-green-800': type === 'success',
            'text-red-800': type === 'error',
            'text-blue-800': type === 'info'
          }">
            {{ title }}
          </h3>
          <div class="mt-1 text-sm" :class="{
            'text-green-700': type === 'success',
            'text-red-700': type === 'error',
            'text-blue-700': type === 'info'
          }">
            {{ message }}
          </div>
        </div>
        <button 
          @click="close"
          class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { CheckCircle, XCircle, Info as InfoIcon, X } from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    default: 'Notification'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const isVisible = ref(props.show);
const timer = ref(null);

const close = () => {
  isVisible.value = false;
  emit('close');
};

const startTimer = () => {
  if (props.duration > 0) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      close();
    }, props.duration);
  }
};

watch(() => props.show, (newValue) => {
  isVisible.value = newValue;
  if (newValue) {
    startTimer();
  }
});

onMounted(() => {
  if (props.show) {
    startTimer();
  }
});

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>