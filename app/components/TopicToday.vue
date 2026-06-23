<template>
  <div class="w-full font-sans">
    <!-- Streak header -->
    <!-- <div class="flex items-center gap-2 mb-6">
      <span class="text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">Today's topic</span>
    </div> -->

    <!-- Empty queue -->
    <HlCard v-if="data.state === 'queue_empty' || !topic" pad>
      <div class="text-center py-8">
        <div class="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:check-check" :size="22" class="text-gray-500" />
        </div>
        <h2 class="text-[18px] font-semibold text-gray-900 mb-1">You're all caught up</h2>
        <p class="text-[13.5px] text-gray-500 max-w-[38ch] mx-auto">You've completed every topic in the queue. New topics are added regularly — check back soon.</p>
      </div>
    </HlCard>

    <template v-else>
      <!-- OVERVIEW -->
      <div v-if="view === 'overview'">
        <div class="bg-white rounded-3xl px-7 pt-7 pb-6 shadow-sm">
          <!-- meta -->
          <div class="flex items-center gap-2 mb-4">
            <HlBadge>{{ topic.category }}</HlBadge>
            <span class="text-[11px] text-gray-400">{{ topic.readMinutes }} min read</span>
            <span class="text-[11px] text-gray-400">· {{ topic.questions.length }} questions</span>
          </div>

          <h1 class="text-[26px] font-semibold tracking-[-0.02em] text-gray-900 leading-tight mb-1.5">{{ topic.title }}</h1>
          <p class="text-[14.5px] text-gray-500 leading-relaxed mb-6">{{ topic.subtitle }}</p>

          <!-- Two choices: read or answer -->
          <div class="grid grid-cols-2 gap-3">
            <button
              :class="[
                'flex flex-col items-start gap-2 text-left p-4 rounded-2xl border transition-colors duration-[120ms] cursor-pointer',
                progress?.articleRead
                  ? 'border-purple-500/30 bg-purple-100/40 hover:bg-purple-100/60'
                  : 'border-gray-200 bg-gray-25 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="openArticle"
            >
              <div class="flex items-center justify-between w-full">
                <Icon name="lucide:book-open" :size="18" :class="progress?.articleRead ? 'text-purple-600' : 'text-gray-700'" />
                <div v-if="progress?.articleRead" class="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                  <Icon name="lucide:check" :size="12" class="text-white" />
                </div>
              </div>
              <span class="text-[14px] font-medium text-gray-900">{{ progress?.articleRead ? 'Article read' : 'Read the article' }}</span>
              <span class="text-[12.5px] text-gray-500 leading-snug">A {{ topic.readMinutes }}-minute lesson on the topic.</span>
            </button>

            <button
              :class="[
                'flex flex-col items-start gap-2 text-left p-4 rounded-2xl border transition-colors duration-[120ms] cursor-pointer',
                progress?.questionsTotal
                  ? 'border-purple-500/30 bg-purple-100/40 hover:bg-purple-100/60'
                  : 'border-gray-200 bg-gray-25 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="openQuestions"
            >
              <div class="flex items-center justify-between w-full">
                <Icon name="lucide:list-checks" :size="18" :class="progress?.questionsTotal ? 'text-purple-600' : 'text-gray-700'" />
                <div v-if="progress?.questionsTotal" class="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                  <Icon name="lucide:check" :size="12" class="text-white" />
                </div>
              </div>
              <span class="text-[14px] font-medium text-gray-900">{{ progress?.questionsTotal ? `Questions done · ${progress.questionsCorrect}/${progress.questionsTotal}` : 'Answer the questions' }}</span>
              <span class="text-[12.5px] text-gray-500 leading-snug">{{ topic.questions.length }} quick multiple-choice questions.</span>
            </button>
          </div>

          <p v-if="!isDone" class="text-[12px] text-gray-400 text-center mt-4">
            Finish both to complete today's practice and keep your streak.
          </p>
        </div>
      </div>

      <!-- ARTICLE -->
      <div v-else-if="view === 'article'" class="bg-white rounded-3xl px-7 pt-6 pb-6 shadow-sm">
        <button class="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0 mb-5 transition-colors duration-[120ms]" @click="view = 'overview'">
          <Icon name="lucide:arrow-left" :size="14" />
          Back
        </button>

        <div class="flex items-center gap-2 mb-3">
          <HlBadge>{{ topic.category }}</HlBadge>
          <span class="font-mono text-[11px] text-gray-400">{{ topic.readMinutes }} min read</span>
        </div>
        <h1 class="text-[24px] font-semibold tracking-[-0.02em] text-gray-900 leading-tight mb-6">{{ topic.title }}</h1>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <article class="lesson-prose" v-html="topic.articleHtml" />

        <div v-if="!isDone && !progress?.articleRead" class="flex items-center justify-between pt-7 mt-7 border-t border-gray-150">
          <span class="text-[12.5px] text-gray-400">{{ progress?.questionsTotal ? 'Last step — mark the article as read to finish.' : 'Step 1 of 2. Answer the questions next.' }}</span>
          <HlButton variant="primary" size="md" :disabled="busy" @click="markRead">
            <Icon name="lucide:check" :size="14" />
            Mark as read
          </HlButton>
        </div>
        <div v-else-if="!isDone && progress?.articleRead" class="pt-7 mt-7 border-t border-gray-150 text-center">
          <span class="text-[12.5px] text-gray-400">Article done. Now answer the questions to finish today's practice.</span>
        </div>
        <div v-else class="pt-7 mt-7 border-t border-gray-150 text-center">
          <HlButton variant="secondary" size="md" @click="openQuestions">Review the questions</HlButton>
        </div>
      </div>

      <!-- QUESTIONS -->
      <div v-else-if="view === 'questions'" class="bg-white rounded-3xl px-7 pt-6 pb-6 shadow-sm">
        <button class="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0 mb-5 transition-colors duration-[120ms]" @click="view = 'overview'">
          <Icon name="lucide:arrow-left" :size="14" />
          Back
        </button>

        <!-- progress segments -->
        <div class="flex items-center gap-1.5 mb-6">
          <div
            v-for="i in topic.questions.length"
            :key="i"
            class="h-1 flex-1 rounded-full transition-colors duration-300"
            :class="i - 1 < qIndex ? 'bg-gray-800' : i - 1 === qIndex ? 'bg-gray-400' : 'bg-gray-200'"
          />
          <span class="font-mono text-[11px] text-gray-400 ml-1 flex-none">{{ qIndex + 1 }}/{{ topic.questions.length }}</span>
        </div>

        <h2 class="text-[19px] font-medium leading-snug tracking-[-0.01em] text-gray-900 mb-5 max-w-[48ch]">{{ activeQuestion.prompt }}</h2>

        <div class="flex flex-col gap-2.5">
          <button
            v-for="(opt, oi) in activeQuestion.options"
            :key="oi"
            :disabled="isDone"
            :class="optionClass(oi)"
            @click="selectOption(oi)"
          >
            <span class="flex-none w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-mono"
              :class="optionMarkerClass(oi)">{{ optionLetter(oi) }}</span>
            <span class="text-[13.5px] leading-snug">{{ opt }}</span>
            <Icon v-if="isDone && oi === activeQuestion.answer" name="lucide:check" :size="15" class="ml-auto text-purple-600 flex-none" />
          </button>
        </div>

        <!-- reveal explanation in review mode -->
        <div v-if="isDone && activeQuestion.explanation" class="mt-4 bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 text-[13px] text-gray-600 leading-relaxed">
          {{ activeQuestion.explanation }}
        </div>

        <div class="flex items-center justify-between pt-6 mt-2">
          <button
            v-if="qIndex > 0"
            class="inline-flex items-center gap-[7px] text-[13px] text-gray-500 hover:text-gray-900 bg-transparent border-none cursor-pointer p-0 transition-colors duration-[120ms]"
            @click="qIndex--"
          >
            <Icon name="lucide:arrow-left" :size="14" class="text-gray-400" />
            Back
          </button>
          <span v-else />

          <HlButton
            variant="primary"
            size="md"
            :disabled="(!isDone && answers[qIndex] < 0) || busy"
            @click="nextQuestion"
          >
            {{ qIndex < topic.questions.length - 1 ? 'Next' : (isDone ? 'Done' : 'Submit answers') }}
            <Icon :name="qIndex < topic.questions.length - 1 ? 'lucide:arrow-right' : 'lucide:check'" :size="14" />
          </HlButton>
        </div>
      </div>

      <!-- RESULTS -->
      <div v-else-if="view === 'results'" class="bg-white rounded-3xl px-7 pt-7 pb-6 shadow-sm">
        <div class="text-center mb-6">
          <div class="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:flame" :size="24" class="text-amber-500" />
          </div>
          <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-1.5">Questions complete</div>
          <h2 class="text-[24px] font-semibold text-gray-900 mb-1">{{ submitResult!.score.correct }} / {{ submitResult!.score.total }} correct</h2>
          <p v-if="progress?.articleRead" class="text-[13.5px] text-gray-500">{{ data.streak }} day streak · next topic unlocks tomorrow</p>
          <p v-else class="text-[13.5px] text-gray-500">Now read the article to finish today's practice.</p>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="r in submitResult!.results"
            :key="r.index"
            class="border border-gray-150 rounded-xl px-4 py-3.5"
          >
            <div class="flex items-start gap-2.5 mb-2">
              <Icon :name="r.correct ? 'lucide:circle-check' : 'lucide:circle-x'" :size="16" :class="r.correct ? 'text-purple-600 mt-0.5' : 'text-red-500 mt-0.5'" class="flex-none" />
              <span class="text-[13.5px] font-medium text-gray-900 leading-snug">{{ topic.questions[r.index].prompt }}</span>
            </div>
            <div class="pl-[26px] text-[12.5px] text-gray-500 leading-relaxed">
              <div v-if="!r.correct && r.selected >= 0" class="text-red-600 mb-0.5">Your answer: {{ topic.questions[r.index].options[r.selected] }}</div>
              <div class="text-gray-700 mb-1">Answer: {{ topic.questions[r.index].options[r.correctIndex] }}</div>
              <div>{{ r.explanation }}</div>
            </div>
          </div>
        </div>

        <div class="text-center pt-6">
          <HlButton variant="primary" size="md" @click="finishResults">Back to today</HlButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getLevelForStreak } from '~/utils/levels'

interface TodayQuestion { prompt: string; options: string[]; answer?: number; explanation?: string }
interface TodayTopic { slug: string; title: string; subtitle: string; category: string; readMinutes: number; articleHtml: string; questions: TodayQuestion[] }
interface TodayProgress { articleRead: boolean; questionsCorrect: number; questionsTotal: number; completedAt: string | null }
interface TodayData {
  state: 'available' | 'in_progress' | 'done_today' | 'queue_empty'
  streak: number
  longestStreak: number
  position: number
  totalTopics: number
  reveal: boolean
  nextUnlocksAt: string | null
  topic: TodayTopic | null
  progress: TodayProgress | null
}
interface SubmitResultItem { index: number; selected: number; correctIndex: number; correct: boolean; explanation: string }
interface SubmitResponse { score: { correct: number; total: number }; results: SubmitResultItem[]; streak: number; longestStreak: number; completedAt: string }

const props = defineProps<{ data: TodayData }>()
const emit = defineEmits<{ refresh: [] }>()

const topic = computed(() => props.data.topic)
const progress = computed(() => props.data.progress)
const isDone = computed(() => props.data.state === 'done_today')
const currentLevel = computed(() => getLevelForStreak(props.data.streak))

type View = 'overview' | 'article' | 'questions' | 'results'
const view = ref<View>('overview')
const qIndex = ref(0)
const answers = ref<number[]>([])
const busy = ref(false)
const submitResult = ref<SubmitResponse | null>(null)

watch(topic, (t) => {
  answers.value = t ? Array(t.questions.length).fill(-1) : []
}, { immediate: true })

const activeQuestion = computed(() => topic.value!.questions[qIndex.value])

function openArticle() {
  view.value = 'article'
}

function openQuestions() {
  qIndex.value = 0
  if (!isDone.value) answers.value = Array(topic.value!.questions.length).fill(-1)
  view.value = 'questions'
}

function optionLetter(i: number) {
  return String.fromCharCode(65 + i)
}

function selectOption(i: number) {
  if (isDone.value) return
  answers.value[qIndex.value] = i
}

function optionClass(oi: number) {
  const base = 'flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-colors duration-[120ms]'
  if (isDone.value) {
    if (oi === activeQuestion.value.answer) return `${base} border-purple-500/40 bg-purple-100/60 cursor-default`
    return `${base} border-gray-200 bg-white cursor-default text-gray-500`
  }
  if (answers.value[qIndex.value] === oi) return `${base} border-gray-800 bg-gray-50 cursor-pointer`
  return `${base} border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 cursor-pointer`
}

function optionMarkerClass(oi: number) {
  if (isDone.value && oi === activeQuestion.value.answer) return 'border-purple-500 text-purple-700 bg-white'
  if (!isDone.value && answers.value[qIndex.value] === oi) return 'border-gray-800 text-gray-900 bg-white'
  return 'border-gray-300 text-gray-400'
}

async function nextQuestion() {
  if (qIndex.value < topic.value!.questions.length - 1) {
    qIndex.value++
    return
  }
  // last question
  if (isDone.value) {
    view.value = 'overview'
    return
  }
  await submitAnswers()
}

async function submitAnswers() {
  if (!topic.value) return
  busy.value = true
  try {
    const res = await $fetch<SubmitResponse>(`/api/topics/${topic.value.slug}/submit`, {
      method: 'POST',
      body: { answers: answers.value },
    })
    submitResult.value = res
    view.value = 'results'
    emit('refresh')
  }
  finally {
    busy.value = false
  }
}

async function markRead() {
  if (!topic.value) return
  busy.value = true
  try {
    await $fetch(`/api/topics/${topic.value.slug}/read`, { method: 'POST' })
    emit('refresh')
    view.value = 'overview'
  }
  finally {
    busy.value = false
  }
}

function finishResults() {
  submitResult.value = null
  view.value = 'overview'
}
</script>
