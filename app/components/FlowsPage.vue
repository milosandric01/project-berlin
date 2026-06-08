<template>
  <div class="w-full font-sans">

    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <!-- <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-1">Manage</div> -->
        <h2 class="text-[22px] font-medium tracking-[-0.01em] text-gray-900">Flows</h2>
        <p class="text-[13px] text-gray-500 mt-1">A flow is a skill or combination of skills you commit to practising. Questions are generated fresh every session — the same flow never runs out.</p>
      </div>
      <HlButton variant="secondary" size="sm" @click="showCreate = true">
        <Icon name="lucide:plus" :size="13" />
        Create flow
      </HlButton>
    </div>

    <div v-if="pending" class="flex items-center gap-2 text-[13px] text-gray-400 py-8">
      <Icon name="lucide:loader" :size="14" class="animate-spin" />
      Loading…
    </div>

    <template v-else>

      <!-- Custom flows -->
      <section class="mb-8">
        <div class="text-[13px] font-medium text-gray-700 mb-3">Your flows</div>

        <div v-if="!data?.customFlows.length" class="bg-white rounded-2xl px-5 py-6 text-center shadow-xs">
          <Icon name="lucide:plus-circle" :size="20" class="text-gray-300 mx-auto mb-2" />
          <p class="text-[13px] text-gray-500">No custom flows yet.</p>
          <button
            class="mt-2 text-[13px] text-gray-700 font-medium underline underline-offset-2 border-none bg-transparent cursor-pointer font-[inherit]"
            @click="showCreate = true"
          >Create your first flow</button>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div
            v-for="flow in data!.customFlows"
            :key="flow.id"
            class="bg-white rounded-2xl px-5 pt-5 pb-4 flex flex-col shadow-xs"
          >
            <!-- Top row: dot + skills path + type label -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full flex-none" :class="flow.isActive ? 'bg-gray-900' : 'bg-gray-400'" />
                <span class="font-mono text-[10.5px] tracking-[0.06em] uppercase text-gray-500 truncate">
                  {{ flow.skills.map(s => s.name).join(' · ') || '—' }}
                </span>
              </div>
              <span class="font-mono text-[10.5px] tracking-[0.06em] uppercase text-gray-400 flex-none ml-2">Custom</span>
            </div>

            <!-- Name -->
            <h3 class="text-[17px] font-medium leading-snug tracking-[-0.01em] text-gray-900 mb-3">
              {{ flow.name }}
            </h3>

            <div class="flex-1" />

            <!-- Stats -->
            <div class="text-[12px] text-gray-400 mb-3">
              {{ flow.totalQuestions }} questions done
              <span v-if="flow.lastPracticedAt" class="text-gray-300"> · </span>
              <span v-if="flow.lastPracticedAt">{{ formatDate(flow.lastPracticedAt) }}</span>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <HlButton
                v-if="!flow.isActive"
                variant="secondary"
                size="sm"
                :disabled="settingActive === flow.id"
                @click="setActive(flow.id)"
              >Set active</HlButton>
              <span v-else class="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                <Icon name="lucide:check" :size="12" class="text-gray-400" />
                Active
              </span>
              <button
                class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-[120ms] border-none bg-transparent cursor-pointer"
                @click="deleteFlow(flow.id)"
              >
                <Icon name="lucide:trash-2" :size="13" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Platform flows -->
      <section>
        <div class="text-[13px] font-medium text-gray-700 mb-3">Platform flows</div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="flow in data!.platformFlows"
            :key="flow.key"
            class="bg-white rounded-2xl px-5 pt-5 pb-4 flex flex-col shadow-xs"
          >
            <!-- Top row: dot + skills path + type label -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full flex-none" :class="flow.isActive ? 'bg-gray-900' : 'bg-gray-400'" />
                <span class="font-mono text-[10.5px] tracking-[0.06em] uppercase text-gray-500 truncate">
                  {{ flow.skillSlugs.map(slugToLabel).join(' · ') }}
                </span>
              </div>
              <span class="font-mono text-[10.5px] tracking-[0.06em] uppercase text-gray-400 flex-none ml-2">Platform</span>
            </div>

            <!-- Name -->
            <h3 class="text-[17px] font-medium leading-snug tracking-[-0.01em] text-gray-900 mb-3">
              {{ flow.name }}
            </h3>

            <div class="flex-1" />

            <!-- Stats (only if user has used this flow) -->
            <div class="text-[12px] text-gray-400 mb-3">
              <template v-if="flow.dbId">
                {{ flow.totalQuestions }} questions done
                <span v-if="flow.lastPracticedAt" class="text-gray-300"> · </span>
                <span v-if="flow.lastPracticedAt">{{ formatDate(flow.lastPracticedAt) }}</span>
              </template>
              <template v-else>Not started yet</template>
            </div>

            <!-- Footer -->
            <div class="pt-3 border-t border-gray-100">
              <HlButton
                v-if="!flow.isActive"
                variant="secondary"
                size="sm"
                :disabled="settingActive === flow.key"
                @click="setPlatformActive(flow)"
              >Set active</HlButton>
              <span v-else class="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                <Icon name="lucide:check" :size="12" class="text-gray-400" />
                Active
              </span>
            </div>
          </div>
        </div>
      </section>

    </template>

    <!-- Create custom flow modal -->
    <HlModal :open="showCreate" @close="showCreate = false">
      <template #title>Create a flow</template>
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-[12.5px] font-medium text-gray-700 mb-1.5">Flow name</label>
          <HlInput v-model="newFlowName" placeholder="e.g. Backend Deep Dive" />
        </div>
        <div>
          <label class="block text-[12.5px] font-medium text-gray-700 mb-2">Skills</label>
          <div class="flex flex-wrap gap-2 max-h-56 overflow-y-auto">
            <button
              v-for="skill in allSkills"
              :key="skill.id"
              class="inline-flex items-center h-8 px-3 rounded-full text-[13px] font-[450] border transition-all duration-[120ms] cursor-pointer font-[inherit]"
              :class="selectedSkillIds.has(skill.id)
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
              @click="toggleSkill(skill.id)"
            >{{ skill.name }}</button>
          </div>
        </div>
      </div>
      <template #footer>
        <HlButton variant="ghost" size="md" @click="showCreate = false">Cancel</HlButton>
        <HlButton
          variant="primary"
          size="md"
          :disabled="!newFlowName.trim() || selectedSkillIds.size === 0 || creating"
          @click="createFlow"
        >{{ creating ? 'Creating…' : 'Create flow' }}</HlButton>
      </template>
    </HlModal>

  </div>
</template>

<script setup lang="ts">
interface Skill { id: number; name: string; slug: string; category: string }
interface CustomFlow {
  id: number
  name: string
  isActive: boolean
  totalQuestions: number
  lastPracticedAt: string | null
  skills: Skill[]
}
interface PlatformFlow {
  key: string
  name: string
  skillSlugs: string[]
  dbId: number | null
  isActive: boolean
  totalQuestions: number
  lastPracticedAt: string | null
  skills: Skill[]
}

const { data, pending, refresh } = await useFetch<{
  customFlows: CustomFlow[]
  platformFlows: PlatformFlow[]
}>('/api/flows')

const { data: skillsData } = await useFetch<Skill[]>('/api/skills')
const allSkills = computed(() => skillsData.value ?? [])

// — Set custom flow active —
const settingActive = ref<number | string | null>(null)

async function setActive(id: number) {
  settingActive.value = id
  await $fetch(`/api/flows/${id}`, { method: 'PATCH', body: { isActive: true } })
  await refresh()
  settingActive.value = null
}

// — Set platform flow active (creates DB record on first use) —
async function setPlatformActive(flow: PlatformFlow) {
  settingActive.value = flow.key
  if (flow.dbId) {
    await $fetch(`/api/flows/${flow.dbId}`, { method: 'PATCH', body: { isActive: true } })
  } else {
    await $fetch('/api/flows', { method: 'POST', body: { name: flow.name, predefinedKey: flow.key, isActive: true } })
  }
  await refresh()
  settingActive.value = null
}

// — Delete custom flow —
async function deleteFlow(id: number) {
  await $fetch(`/api/flows/${id}`, { method: 'DELETE' })
  await refresh()
}

// — Create custom flow —
const showCreate = ref(false)
const newFlowName = ref('')
const selectedSkillIds = ref(new Set<number>())
const creating = ref(false)

function toggleSkill(id: number) {
  selectedSkillIds.value.has(id) ? selectedSkillIds.value.delete(id) : selectedSkillIds.value.add(id)
}

async function createFlow() {
  if (!newFlowName.value.trim() || selectedSkillIds.value.size === 0) return
  creating.value = true
  await $fetch('/api/flows', {
    method: 'POST',
    body: { name: newFlowName.value.trim(), skillIds: [...selectedSkillIds.value] },
  })
  await refresh()
  newFlowName.value = ''
  selectedSkillIds.value = new Set()
  showCreate.value = false
  creating.value = false
}

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\band\b/g, '&').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
