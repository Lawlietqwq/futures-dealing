import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const role = store.getters && store.getters.role

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      // const hasPermission = roles.some(role => {
      //   return permissionRoles.includes(role)
      // })
      const hasPermission = permissionRoles.includes(role)
    

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
