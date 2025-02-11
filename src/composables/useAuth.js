import { ref } from 'vue'
import { auth } from '../firebase'

export function useAuth() {
  const user = ref(auth.currentUser)
  
  auth.onAuthStateChanged(_user => {
    user.value = _user
  })

  return { user }
}