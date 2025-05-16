<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 z-50 max-w-xs transition-all duration-300 ease-in-out"
      :class="{
        'translate-y-0 opacity-100': isVisible,
        'translate-y-8 opacity-0': !isVisible
      }"
      role="alert"
      tabindex="-1"
      :aria-labelledby="`toast-${type}-label`"
    >
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg">
        <div class="flex p-4">
          <div class="shrink-0">
            <CheckCircle v-if="type === 'success'" class="shrink-0 size-4 text-teal-500 mt-0.5" />
            <XCircle v-else-if="type === 'error'" class="shrink-0 size-4 text-red-500 mt-0.5" />
            <AlertCircle v-else-if="type === 'warning'" class="shrink-0 size-4 text-yellow-500 mt-0.5" />
            <InfoIcon v-else class="shrink-0 size-4 text-blue-500 mt-0.5" />
          </div>
          <div class="ms-3">
            <p :id="`toast-${type}-label`" class="text-sm text-gray-700">
              {{ message }}
            </p>
          </div>
          <button 
            @click="close"
            class="ms-auto shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { CheckCircle, XCircle, AlertCircle, Info as InfoIcon, X } from 'lucide-vue-next';

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
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
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