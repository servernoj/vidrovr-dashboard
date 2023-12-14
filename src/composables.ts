import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import { ref } from 'vue'

export const useSpinner = () => {
  const isActive = ref<boolean>(false)
  const spinner = ref<ActiveLoader>()

  const show = (container?: HTMLElement) => {
    spinner.value = useLoading({
      isFullPage: Boolean(container),
      container,
      opacity: 0
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
