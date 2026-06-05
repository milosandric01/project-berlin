<template>
  <div class="hl-shell">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="side-brand">
        <img src="/honeloop-mark.svg" alt="" />
        <span class="word">Honeloop</span>
      </div>

      <div class="side-search">
        <Icon name="lucide:search" :size="15" class="hicon" />
        <span class="ph">Search questions</span>
        <kbd>/</kbd>
      </div>

      <div class="nav-section">
        <button v-for="n in navItems" :key="n.id" :class="['nav-item', { 'is-active': n.id === 'today' }]">
          <Icon :name="n.icon" :size="16" class="hicon" />
          {{ n.label }}
          <span v-if="n.count != null" class="count">{{ n.count }}</span>
        </button>
      </div>

      <div class="nav-label">Topics</div>
      <div class="nav-section">
        <button v-for="t in topicList" :key="t.id" class="nav-item">
          <HlTopicDot :color="t.color" :style="{ marginLeft: '3px', marginRight: '3px' }" />
          {{ t.label }}
        </button>
      </div>

      <div class="side-spacer" />

      <button class="nav-item ask">
        <Icon name="lucide:sparkles" :size="16" class="hicon" />
        Ask Honeloop
      </button>

      <div class="side-user-wrap">
        <div v-if="userMenuOpen" class="user-menu">
          <div class="um-header">{{ user?.email }}</div>
          <div class="um-sep" />
          <button class="um-item" @click="logout">
            <Icon name="lucide:log-out" :size="14" class="hicon" />
            Log out
          </button>
        </div>
        <button class="side-user" @click="userMenuOpen = !userMenuOpen">
          <HlAvatar :initials="userInitials" :size="30" />
          <div :style="{ flex: 1, minWidth: 0 }">
            <div class="nm">{{ userDisplayName }}</div>
            <div class="st">
              <Icon name="lucide:flame" :size="12" class="hicon" />
              {{ STREAK.current }} day streak
            </div>
          </div>
          <Icon name="lucide:chevrons-up-down" :size="14" :style="{ color: 'var(--fg-quaternary)' }" />
        </button>
      </div>
    </aside>

    <div v-if="userMenuOpen" class="user-menu-overlay" @click="userMenuOpen = false" />

    <!-- MAIN CONTENT -->
    <main class="main--wide">
      <div class="work-inner">
        <div class="topbar">
          <div>
            <div class="eyebrow">Good morning, Alex · Tuesday, June 3</div>
            <h1>Today</h1>
          </div>
          <div class="right">
            <HlStreakChip>
              <Icon name="lucide:flame" :size="14" class="hicon" />
              47
            </HlStreakChip>
          </div>
        </div>

        <div class="work-grid">
          <!-- LEFT COLUMN -->
          <div>
            <div class="hero-band">
              <div class="hb-main">
                <div class="eyebrow">Today&rsquo;s loop · 4 questions</div>
                <h2>Four questions to keep you interview-sharp.</h2>
                <div class="hb-meta">
                  <Icon name="lucide:clock" :size="13" class="hicon" />
                  <span>About 6 minutes</span>
                  <span :style="{ color: 'var(--accent-300)' }">·</span>
                  <Icon name="lucide:target" :size="13" :style="{ color: 'var(--accent)' }" class="hicon" />
                  <span>2 target your weak spots</span>
                </div>
              </div>
              <div class="hb-side">
                <div class="hb-prog">
                  <SegRing :done="0" :total="4" :size="64" />
                  <span class="hb-prog-cap">done today</span>
                </div>
                <HlButton variant="primary" size="md">
                  <Icon name="lucide:play" :size="15" />
                  <span>Start loop</span>
                </HlButton>
              </div>
            </div>

            <div class="section-head" :style="{ marginTop: '18px', marginBottom: '10px' }">
              <h2>Recommended for you</h2>
              <span class="link">See all <Icon name="lucide:arrow-right" :size="13" /></span>
            </div>
            <div class="section-sub" :style="{ marginBottom: '14px' }">Weak spots first, then due for review.</div>

            <div class="rec-list">
              <div v-for="(q, i) in RECOMMENDED" :key="q.id" class="rec-card">
                <span class="rc-dot" :style="{ background: TOPICS[q.topic].color }" />
                <div class="rc-body">
                  <div class="rc-q">{{ q.q }}</div>
                  <div class="rc-meta">
                    <span class="tn">{{ TOPICS[q.topic].label }}</span>
                    <DiffBadge :level="q.difficulty" />
                    <HlWhyTag v-if="i < 3" type="weak">
                      <Icon name="lucide:target" :size="11" class="hicon" />weak spot
                    </HlWhyTag>
                  </div>
                </div>
                <span class="rc-go">
                  <Icon name="lucide:arrow-up-right" :size="16" />
                </span>
              </div>
            </div>
          </div>

          <!-- RIGHT RAIL -->
          <div class="rail">
            <HlCard class="rail-card rail-streak">
              <div class="rc-h"><Icon name="lucide:flame" :size="14" class="hicon" />Streak</div>
              <div class="top">
                <span class="big">{{ STREAK.current }}</span>
                <span class="sub">days · longest {{ STREAK.longest }}</span>
              </div>
              <div class="rail-week">
                <div v-for="(d, i) in weekDays" :key="i" :class="['d', { on: STREAK.week[i] === 1, today: STREAK.week[i] === 2 }]">
                  {{ d }}
                </div>
              </div>
            </HlCard>

            <HlCard class="rail-card">
              <div class="rc-h"><Icon name="lucide:target" :size="14" class="hicon" />Mastery by topic<span class="more">6 topics</span></div>
              <div class="mini-meter">
                <div v-for="m in MASTERY" :key="m.topic" class="mini-bar">
                  <span class="nm">{{ TOPICS[m.topic].label }}</span>
                  <span :class="['trend', m.trend > 0 ? 'up' : m.trend < 0 ? 'down' : 'flat']">
                    <Icon :name="m.trend > 0 ? 'lucide:arrow-up' : m.trend < 0 ? 'lucide:arrow-down' : 'lucide:minus'" :size="11" />
                    {{ Math.abs(m.trend) }}
                  </span>
                  <span class="track"><span class="fill" :style="{ width: m.pct + '%', background: TOPICS[m.topic].color }" /></span>
                </div>
              </div>
            </HlCard>
          </div>
        </div>

        <!-- FULL-WIDTH CONSISTENCY STRIP -->
        <HlCard class="consistency-card">
          <div class="cons-head">
            <div class="rc-h"><Icon name="lucide:calendar-check" :size="14" class="hicon" />Daily consistency</div>
            <span class="cons-sub">Last 17 weeks · keeping the loop alive</span>
          </div>
          <div class="cons-main">
            <div class="cons-heat">
              <div class="heat-grid">
                <div v-for="(col, ci) in HEAT" :key="ci" class="heat-col">
                  <span v-for="(v, ri) in col" :key="ri" :class="'heat-cell lv' + v" />
                </div>
              </div>
              <div class="heat-legend">
                <span>Less</span>
                <span class="heat-cell lv0" />
                <span class="heat-cell lv1" />
                <span class="heat-cell lv2" />
                <span class="heat-cell lv3" />
                <span>More</span>
              </div>
            </div>
            <div class="cons-divider" />
            <div class="cons-stats">
              <div class="cs"><div class="v">{{ STREAK.current }}</div><div class="k">current streak</div></div>
              <div class="cs"><div class="v">{{ STREAK.longest }}</div><div class="k">longest streak</div></div>
              <div class="cs"><div class="v">{{ activeThisWeek }} / 7</div><div class="k">active this week</div></div>
              <div class="cs"><div class="v">{{ STREAK.totalSolved }}</div><div class="k">solved all-time</div></div>
            </div>
          </div>
        </HlCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { data: authData } = await useFetch('/api/auth/user')
const user = computed(() => authData.value?.user)

const userDisplayName = computed(() => {
  const email = user.value?.email ?? ''
  return email.split('@')[0] || email
})

const userInitials = computed(() => {
  return userDisplayName.value.slice(0, 2).toUpperCase()
})

const userMenuOpen = ref(false)

async function logout() {
  userMenuOpen.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/login')
}

const TOPICS: Record<string, { id: string; label: string; color: string }> = {
  'system-design':   { id: 'system-design',   label: 'System design',      color: '#3e63dd' },
  'data-structures': { id: 'data-structures', label: 'Data structures',    color: '#7c5cde' },
  'js-ts':           { id: 'js-ts',           label: 'JavaScript / TS',    color: '#2aa7a0' },
  'databases':       { id: 'databases',       label: 'Databases',          color: '#30a46c' },
  'distributed':     { id: 'distributed',     label: 'Distributed systems',color: '#c99a2e' },
  'behavioral':      { id: 'behavioral',      label: 'Behavioral',         color: '#d76b9a' },
}

const topicList = Object.values(TOPICS).slice(0, 5)

const navItems = [
  { id: 'today',    label: 'Today',    icon: 'lucide:sun',         count: 4 },
  { id: 'practice', label: 'Practice', icon: 'lucide:rotate-ccw',  count: null },
  { id: 'library',  label: 'Library',  icon: 'lucide:library',     count: null },
  { id: 'progress', label: 'Progress', icon: 'lucide:trending-up', count: null },
]

const STREAK = { current: 47, longest: 63, totalSolved: 612, week: [1, 1, 1, 1, 2, 0, 0] }
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const activeThisWeek = STREAK.week.filter(v => v === 1).length

const MASTERY = [
  { topic: 'databases',       pct: 41, trend: -3 },
  { topic: 'distributed',     pct: 52, trend: +6 },
  { topic: 'data-structures', pct: 64, trend: +2 },
  { topic: 'js-ts',           pct: 70, trend: 0 },
  { topic: 'system-design',   pct: 78, trend: +4 },
  { topic: 'behavioral',      pct: 83, trend: +1 },
]

const RECOMMENDED = [
  { id: 'r1', topic: 'databases',       difficulty: 'Medium', q: 'Explain isolation levels using a concrete double-booking example.' },
  { id: 'r2', topic: 'distributed',     difficulty: 'Hard',   q: 'What breaks first when you add a second region, and how do you find out?' },
  { id: 'r3', topic: 'databases',       difficulty: 'Hard',   q: 'Design a schema for a multi-tenant app that stays fast at 10k tenants.' },
  { id: 'r4', topic: 'data-structures', difficulty: 'Medium', q: 'When is a heap the right call over a sorted array?' },
]

// Generate 17 weeks x 7 days heatmap
const HEAT = Array.from({ length: 17 }, () =>
  Array.from({ length: 7 }, () => Math.random() < 0.18 ? 0 : 1 + Math.floor(Math.random() * 3))
)
</script>
