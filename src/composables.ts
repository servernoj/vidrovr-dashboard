import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import { ref } from 'vue'

export const useSpinner = () => {
  const isActive = ref<boolean>(false)
  const spinner = ref<ActiveLoader>()

  const show = () => {
    spinner.value = useLoading({
      backgroundColor: '#888'
    }).show()
    isActive.value = true
  }

  const hide = () => {
    spinner.value?.hide()
    isActive.value = false
  }

  return {
    spinnerShow: show,
    spinnerHide: hide,
    spinnerIsActive: isActive
  }
}
