<template>
  <div class="min-h-screen bg-sand-50 text-gray-900 font-sans">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="text-gray-500 hover:text-gray-900 transition-colors">
            <Icon name="lucide:arrow-left" :size="18" />
          </NuxtLink>
          <h1 class="text-lg font-semibold">Topic Queue</h1>
        </div>
        <button
          class="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          @click="openCreate"
        >
          + New Topic
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl px-5 py-4 shadow-sm animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Topics list -->
      <div v-else>
        <!-- Published section -->
        <section class="mb-10">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="lucide:check-circle" :size="16" class="text-emerald-500" />
            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Published Queue</h2>
            <span class="text-xs text-gray-400 ml-1">({{ publishedTopics.length }})</span>
          </div>

          <div v-if="!publishedTopics.length" class="text-sm text-gray-400 italic pl-6">
            No published topics yet. Publish articles below to add them to the queue.
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="(topic, idx) in publishedTopics"
              :key="topic.slug"
              class="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div class="px-5 py-4 flex items-center gap-4">
                <!-- Position -->
                <span class="font-mono text-xs text-gray-400 w-6 text-center flex-none">{{ idx + 1 }}</span>

                <!-- Reorder buttons -->
                <div class="flex flex-col gap-0.5 flex-none">
                  <button
                    :disabled="idx === 0"
                    class="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    @click="moveUp(idx)"
                  >
                    <Icon name="lucide:chevron-up" :size="14" />
                  </button>
                  <button
                    :disabled="idx === publishedTopics.length - 1"
                    class="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    @click="moveDown(idx)"
                  >
                    <Icon name="lucide:chevron-down" :size="14" />
                  </button>
                </div>

                <!-- Topic info -->
                <div class="flex-1 min-w-0 cursor-pointer" @click="openEdit(topic)">
                  <div class="flex items-center gap-2 mb-0.5">
                    <h3 class="text-sm font-medium text-gray-900 truncate">{{ topic.title }}</h3>
                    <span class="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-none">{{ topic.category }}</span>
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ topic.readMinutes }} min read · {{ topic.questionsCount }} questions · <span class="font-mono">{{ topic.slug }}</span>
                  </div>
                </div>

                <!-- Edit button -->
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex-none"
                  @click="openEdit(topic)"
                >
                  <Icon name="lucide:pencil" :size="16" />
                </button>

                <!-- Expand questions -->
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex-none"
                  @click="toggleExpand(topic.slug)"
                >
                  <Icon :name="expanded.has(topic.slug) ? 'lucide:chevron-up' : 'lucide:list'" :size="16" />
                </button>

                <!-- Unpublish button -->
                <button
                  class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex-none"
                  @click="unpublish(topic.slug)"
                >
                  Unpublish
                </button>
              </div>

              <!-- Expanded questions panel -->
              <div v-if="expanded.has(topic.slug)" class="border-t border-gray-100 px-5 py-3 bg-gray-50/50 rounded-b-xl">
                <div class="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-2">Questions</div>
                <ol class="flex flex-col gap-2">
                  <li v-for="(q, qi) in topic.questions" :key="qi" class="text-sm">
                    <div class="font-medium text-gray-800 mb-1">{{ qi + 1 }}. {{ q.prompt }}</div>
                    <div class="pl-4 flex flex-col gap-0.5">
                      <div
                        v-for="(opt, oi) in q.options"
                        :key="oi"
                        :class="['text-xs py-0.5 px-2 rounded', oi === q.answer ? 'text-emerald-700 bg-emerald-50 font-medium' : 'text-gray-500']"
                      >
                        {{ String.fromCharCode(65 + oi) }}. {{ opt }}
                      </div>
                    </div>
                    <div v-if="q.explanation" class="text-xs text-gray-400 italic mt-1 pl-4">{{ q.explanation }}</div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Save order button -->
          <div v-if="orderDirty" class="mt-4 flex justify-end">
            <button
              class="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              :disabled="saving"
              @click="saveOrder"
            >
              {{ saving ? 'Saving...' : 'Save Order' }}
            </button>
          </div>
        </section>

        <!-- Drafts section -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <Icon name="lucide:file-text" :size="16" class="text-gray-400" />
            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Drafts</h2>
            <span class="text-xs text-gray-400 ml-1">({{ draftTopics.length }})</span>
          </div>

          <div v-if="!draftTopics.length" class="text-sm text-gray-400 italic pl-6">
            All topics are published.
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="topic in draftTopics"
              :key="topic.slug"
              class="bg-white rounded-xl shadow-sm border border-dashed border-gray-200"
            >
              <div class="px-5 py-4 flex items-center gap-4">
                <!-- Topic info -->
                <div class="flex-1 min-w-0 cursor-pointer" @click="openEdit(topic)">
                  <div class="flex items-center gap-2 mb-0.5">
                    <h3 class="text-sm font-medium text-gray-900 truncate">{{ topic.title }}</h3>
                    <span class="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-none">{{ topic.category }}</span>
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ topic.readMinutes }} min read · {{ topic.questionsCount }} questions · <span class="font-mono">{{ topic.slug }}</span>
                  </div>
                </div>

                <!-- Edit button -->
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex-none"
                  @click="openEdit(topic)"
                >
                  <Icon name="lucide:pencil" :size="16" />
                </button>

                <!-- Expand questions -->
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex-none"
                  @click="toggleExpand(topic.slug)"
                >
                  <Icon :name="expanded.has(topic.slug) ? 'lucide:chevron-up' : 'lucide:list'" :size="16" />
                </button>

                <!-- Publish button -->
                <button
                  class="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors flex-none"
                  @click="publish(topic.slug)"
                >
                  Publish
                </button>
              </div>

              <!-- Expanded questions panel -->
              <div v-if="expanded.has(topic.slug)" class="border-t border-gray-100 px-5 py-3 bg-gray-50/50 rounded-b-xl">
                <div class="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-2">Questions</div>
                <ol class="flex flex-col gap-2">
                  <li v-for="(q, qi) in topic.questions" :key="qi" class="text-sm">
                    <div class="font-medium text-gray-800 mb-1">{{ qi + 1 }}. {{ q.prompt }}</div>
                    <div class="pl-4 flex flex-col gap-0.5">
                      <div
                        v-for="(opt, oi) in q.options"
                        :key="oi"
                        :class="['text-xs py-0.5 px-2 rounded', oi === q.answer ? 'text-emerald-700 bg-emerald-50 font-medium' : 'text-gray-500']"
                      >
                        {{ String.fromCharCode(65 + oi) }}. {{ opt }}
                      </div>
                    </div>
                    <div v-if="q.explanation" class="text-xs text-gray-400 italic mt-1 pl-4">{{ q.explanation }}</div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/40" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 class="text-base font-semibold">{{ editingSlug ? 'Edit Topic' : 'New Topic' }}</h2>
          <button class="text-gray-400 hover:text-gray-700" @click="showModal = false">
            <Icon name="lucide:x" :size="18" />
          </button>
        </div>

        <div class="px-6 py-5 flex flex-col gap-4">
          <!-- Slug (only editable when creating) -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Slug</label>
            <input
              v-model="form.slug"
              :disabled="!!editingSlug"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="e.g. how-dns-works"
            />
          </div>

          <!-- Title -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
            <input
              v-model="form.title"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Topic title"
            />
          </div>

          <!-- Subtitle -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtitle</label>
            <input
              v-model="form.subtitle"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Short description"
            />
          </div>

          <!-- Category + Read time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
              <input
                v-model="form.category"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                placeholder="e.g. Networking"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Read time (min)</label>
              <input
                v-model.number="form.readMinutes"
                type="number"
                min="1"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <!-- Article markdown -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Article (Markdown)</label>
            <textarea
              v-model="form.articleMarkdown"
              rows="12"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-y"
              placeholder="Write the article content in Markdown..."
            />
          </div>

          <!-- Questions (JSON) -->
          <div>
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Questions (JSON)</label>
              <button
                v-if="!form.questionsRaw"
                class="text-xs text-gray-400 hover:text-gray-700"
                @click="form.questionsRaw = JSON.stringify([{ prompt: '', options: ['', '', '', ''], answer: 0, explanation: '' }], null, 2)"
              >
                Add template
              </button>
            </div>
            <textarea
              v-model="form.questionsRaw"
              rows="10"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-y"
              placeholder='[{ "prompt": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]'
            />
            <p v-if="questionsError" class="text-xs text-red-500 mt-1">{{ questionsError }}</p>
          </div>

          <!-- Modal error -->
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-700 text-sm">
            {{ modalError }}
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            @click="showModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            :disabled="modalSaving"
            @click="saveTopic"
          >
            {{ modalSaving ? 'Saving...' : (editingSlug ? 'Save Changes' : 'Create Topic') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface TopicQuestion {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

interface TopicItem {
  slug: string
  title: string
  subtitle: string
  category: string
  readMinutes: number
  articleMarkdown: string
  questionsCount: number
  questions: TopicQuestion[]
  published: boolean
  position: number
}

const loading = ref(true)
const error = ref<string | null>(null)
const topics = ref<TopicItem[]>([])
const publishedTopics = ref<TopicItem[]>([])
const orderDirty = ref(false)
const saving = ref(false)
const expanded = reactive(new Set<string>())

// Modal state
const showModal = ref(false)
const editingSlug = ref<string | null>(null)
const modalSaving = ref(false)
const modalError = ref<string | null>(null)
const form = reactive({
  slug: '',
  title: '',
  subtitle: '',
  category: 'General',
  readMinutes: 3,
  articleMarkdown: '',
  questionsRaw: '',
})

const questionsError = computed(() => {
  if (!form.questionsRaw.trim()) return null
  try {
    const arr = JSON.parse(form.questionsRaw)
    if (!Array.isArray(arr)) return 'Must be a JSON array'
    return null
  }
  catch {
    return 'Invalid JSON'
  }
})

const draftTopics = computed(() => topics.value.filter(t => !t.published))

function openCreate() {
  editingSlug.value = null
  modalError.value = null
  form.slug = ''
  form.title = ''
  form.subtitle = ''
  form.category = 'General'
  form.readMinutes = 3
  form.articleMarkdown = ''
  form.questionsRaw = '[]'
  showModal.value = true
}

function openEdit(topic: TopicItem) {
  editingSlug.value = topic.slug
  modalError.value = null
  form.slug = topic.slug
  form.title = topic.title
  form.subtitle = topic.subtitle
  form.category = topic.category
  form.readMinutes = topic.readMinutes
  form.articleMarkdown = topic.articleMarkdown
  form.questionsRaw = JSON.stringify(topic.questions, null, 2)
  showModal.value = true
}

async function saveTopic() {
  if (questionsError.value) return
  modalSaving.value = true
  modalError.value = null

  const questions = form.questionsRaw.trim() ? JSON.parse(form.questionsRaw) : []

  try {
    if (editingSlug.value) {
      await $fetch(`/api/admin/topics/${editingSlug.value}`, {
        method: 'PATCH',
        body: {
          title: form.title,
          subtitle: form.subtitle,
          category: form.category,
          readMinutes: form.readMinutes,
          articleMarkdown: form.articleMarkdown,
          questions,
        },
      })
    }
    else {
      await $fetch('/api/admin/topics', {
        method: 'POST',
        body: {
          slug: form.slug,
          title: form.title,
          subtitle: form.subtitle,
          category: form.category,
          readMinutes: form.readMinutes,
          articleMarkdown: form.articleMarkdown,
          questions,
        },
      })
    }
    showModal.value = false
    await fetchTopics()
  }
  catch (e: any) {
    modalError.value = e?.data?.message || 'Failed to save topic'
  }
  finally {
    modalSaving.value = false
  }
}

async function fetchTopics() {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch<{ topics: TopicItem[] }>('/api/admin/topics')
    topics.value = res.topics
    publishedTopics.value = res.topics.filter(t => t.published)
  }
  catch (e: any) {
    error.value = e?.data?.message || 'Failed to load topics'
  }
  finally {
    loading.value = false
  }
}

async function publish(slug: string) {
  const nextPosition = publishedTopics.value.length + 1
  await $fetch(`/api/admin/topics/${slug}`, {
    method: 'PATCH',
    body: { published: true, position: nextPosition },
  })
  await fetchTopics()
  orderDirty.value = false
}

async function unpublish(slug: string) {
  await $fetch(`/api/admin/topics/${slug}`, {
    method: 'PATCH',
    body: { published: false },
  })
  await fetchTopics()
  orderDirty.value = false
}

function moveUp(idx: number) {
  if (idx === 0) return
  const arr = publishedTopics.value
  const temp = arr[idx]
  arr.splice(idx, 1)
  arr.splice(idx - 1, 0, temp)
  orderDirty.value = true
}

function moveDown(idx: number) {
  const arr = publishedTopics.value
  if (idx >= arr.length - 1) return
  const temp = arr[idx]
  arr.splice(idx, 1)
  arr.splice(idx + 1, 0, temp)
  orderDirty.value = true
}

function toggleExpand(slug: string) {
  if (expanded.has(slug)) expanded.delete(slug)
  else expanded.add(slug)
}

async function saveOrder() {
  saving.value = true
  try {
    const order = publishedTopics.value.map((t, i) => ({ slug: t.slug, position: i + 1 }))
    await $fetch('/api/admin/topics/reorder', {
      method: 'POST',
      body: { order },
    })
    orderDirty.value = false
    await fetchTopics()
  }
  catch (e: any) {
    error.value = e?.data?.message || 'Failed to save order'
  }
  finally {
    saving.value = false
  }
}

onMounted(fetchTopics)
</script>
