<template>
 <div class="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-2 text-cyan-400">SecureShell</h1>
      <p class="text-gray-400">Your secure password vault</p>
      
      <div class="flex justify-center gap-4 mt-4">
        <button 
          v-if="!user"
          @click="signInWithGoogle"
          class="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg flex items-center transition-all"
        >
          Sign in with Google
        </button>
        <div v-else class="flex items-center gap-4">
          <img :src="user.photoURL" class="h-10 w-10 rounded-full" />
          <span>{{ user.displayName }}</span>
          <button 
            @click="signOut"
            class="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <main v-if="user" class="max-w-2xl mx-auto">
      <!-- Entries List -->
      <div class="space-y-4">
        <div 
          v-for="(entry, index) in entries" 
          :key="index"
          class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
        >
        <div 
    class="p-4 cursor-pointer flex justify-between items-center"
    @click="toggleEntry(index)"
  >
    <div class="flex items-center gap-2">
      <h3 class="font-semibold">{{ entry.siteName }}</h3>
      <div class="flex gap-2 items-center">
        <span 
          v-if="entry.category"
          class="text-xs px-2 py-1 rounded-full bg-cyan-900 text-cyan-300"
        >
          {{ entry.category }}
        </span>
        <ChevronDownIcon 
          class="h-4 w-4 transform transition-transform text-gray-400"
          :class="{ 'rotate-180': entry.isOpen }"
        />
      </div>
    </div>
 
  </div>
          
  <transition name="slide">
    <div v-if="entry.isOpen" class="px-4 pb-4 pt-2 border-t border-gray-700 ">
      <p class="text-gray-400 mb-4">{{ entry.description }}</p>
      
      <!-- Password Section -->
      <div class="mb-4">
        <div class="flex items-center">
          <span class="mr-2">{{ entry.showPassword ? entry.password : maskedPassword(entry.password) }}</span>
          <button 
            @click.stop="togglePasswordVisibility(index)"
            class="text-cyan-400 hover:text-cyan-300"
          >
            <EyeIcon v-if="!entry.showPassword" class="h-5 w-5" />
            <EyeSlashIcon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-3 mt-4">
        <button 
          @click.stop="copyToClipboard(entry.password)"
          class="text-gray-400 hover:text-cyan-400"
          title="Copy password"
        >
          <ClipboardDocumentIcon class="h-5 w-5" />
        </button>
        <button 
          @click.stop="openEdit(index)"
          class="text-gray-400 hover:text-cyan-400"
          title="Edit entry"
        >
          <PencilIcon class="h-5 w-5" />
        </button>
        <button 
          @click.stop="deleteEntry(index)"
          class="text-gray-400 hover:text-red-500"
          title="Delete entry"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </transition>
        </div>
      </div>

      <!-- Add Entry FAB -->
      <button 
        @click="showAddForm = true"
        class="fixed bottom-8 right-8 bg-cyan-600 hover:bg-cyan-500 p-4 rounded-full shadow-lg transition-all"
      >
        <PlusIcon class="h-6 w-6" />
      </button>

      <!-- Add Entry Modal -->
      <div v-if="showAddForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-gray-800 p-6 rounded-xl w-full max-w-md">
          <h2 class="text-2xl mb-6">Add New Entry</h2>
          <form @submit.prevent="addEntry">
            <div class="space-y-4">
              <div>
                <label class="block mb-2">Site Name</label>
                <input 
                  v-model="newEntry.siteName"
                  type="text" 
                  class="w-full bg-gray-700 rounded-lg px-4 py-2"
                  required
                >
              </div>
              <div>
                <label class="block mb-2">Description</label>
                <textarea 
                  v-model="newEntry.description"
                  class="w-full bg-gray-700 rounded-lg px-4 py-2"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label class="block mb-2">Category/Tag</label>
                <input 
                  v-model="newEntry.category"
                  type="text" 
                  class="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="e.g. Social Media"
                >
              </div>
              <div>
                <label class="block mb-2">Password</label>
                <input 
                  v-model="newEntry.password"
                  type="password" 
                  class="w-full bg-gray-700 rounded-lg px-4 py-2"
                  required
                >
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-8">
              <button 
                type="button"
                @click="showAddForm = false"
                class="px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-gray-800 p-6 rounded-xl w-full max-w-md">
      <h2 class="text-2xl mb-6">Edit Entry</h2>
      <form @submit.prevent="saveEdit">
        <div class="space-y-4">
          <div>
            <label class="block mb-2">Site Name</label>
            <input 
              v-model="editedEntry.siteName"
              type="text" 
              class="w-full bg-gray-700 rounded-lg px-4 py-2"
              required
            >
          </div>
          <div>
            <label class="block mb-2">Description</label>
            <textarea 
              v-model="editedEntry.description"
              class="w-full bg-gray-700 rounded-lg px-4 py-2"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label class="block mb-2">Category/Tag</label>
            <input 
              v-model="editedEntry.category"
              type="text" 
              class="w-full bg-gray-700 rounded-lg px-4 py-2"
              placeholder="e.g. Social Media"
            >
          </div>
          <div>
            <label class="block mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="editedEntry.password"
                :type="showEditPassword ? 'text' : 'password'"
                class="w-full bg-gray-700 rounded-lg px-4 py-2 pr-10"
                required
              >
              <button 
                type="button"
                @click="showEditPassword = !showEditPassword"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-cyan-400"
              >
                <EyeIcon v-if="!showEditPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-8">
          <button 
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
    </main>
      <!-- Loading overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuth } from './composables/useAuth'
import { 
  auth, db, provider, signInWithPopup, 
  collection, doc, getDocs, setDoc, deleteDoc 
} from './firebase'
import { 
  PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, ChevronDownIcon, PencilIcon 
} from '@heroicons/vue/24/outline'

const { user } = useAuth()
const loading = ref(true)
const entries = ref([])
const showAddForm = ref(false)
const newEntry = reactive({
  siteName: '',
  description: '',
  password: '',
  category: ''
})
const showEditForm = ref(false)
const showEditPassword = ref(false)
const editingIndex = ref(null)
const editedEntry = reactive({
  id: '',
  siteName: '',
  description: '',
  password: '',
  category: ''
})

// Firebase operations
const signInWithGoogle = async () => {
  try {
    loading.value = true
    await signInWithPopup(auth, provider)
  } finally {
    loading.value = false
  }
}

const signOut = async () => {
  await auth.signOut()
}

const loadEntries = async () => {
  if (!user.value) return
  const querySnapshot = await getDocs(collection(db, 'users', user.value.uid, 'entries'))
  entries.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Add this function here
function toggleEntry(index) {
  entries.value[index].isOpen = !entries.value[index].isOpen
}
function maskedPassword(pwd) {
  return '*'.repeat(pwd.length)
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}
function togglePasswordVisibility(index) {
  entries.value[index].showPassword = !entries.value[index].showPassword
}
const addEntry = async () => {
  try {
    const entryRef = doc(collection(db, 'users', user.value.uid, 'entries'))
    await setDoc(entryRef, {
      ...newEntry,
      createdAt: new Date().toISOString(),
      showPassword: false,
      isOpen: false
    })
    await loadEntries()
    
    // Reset form and close modal
    Object.assign(newEntry, {
      siteName: '',
      description: '',
      password: '',
      category: ''
    })
    showAddForm.value = false
  } catch (error) {
    console.error('Error adding entry:', error)
  }
}

const openEdit = (index) => {
  Object.assign(editedEntry, entries.value[index])
  editingIndex.value = index
  showEditForm.value = true
}

const cancelEdit = () => {
  showEditForm.value = false
  editingIndex.value = null
  Object.assign(editedEntry, {
    id: '',
    siteName: '',
    description: '',
    password: '',
    category: ''
  })
}

const deleteEntry = async (index) => {
  await deleteDoc(doc(db, 'users', user.value.uid, 'entries', entries.value[index].id))
  await loadEntries()
}

const saveEdit = async () => {
  const entryRef = doc(db, 'users', user.value.uid, 'entries', editedEntry.id)
  await setDoc(entryRef, editedEntry)
  await loadEntries()
  showEditForm.value = false
}

// Initialize entries when user logs in
onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) await loadEntries()
    loading.value = false
  })
})
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>