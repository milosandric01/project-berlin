<template>
  <div class="w-full font-sans">

    <!-- Header -->
    <div class="mb-8">
      <!-- <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-1">Catalogue</div> -->
      <h2 class="text-[22px] font-medium tracking-[-0.01em] text-gray-900">Skills</h2>
      <p class="text-[13px] text-gray-500 mt-1">The building blocks of your flows. {{ totalSkills }} skills across {{ categories.length }} categories.</p>
    </div>

    <!-- Categories -->
    <div class="flex flex-col gap-6">
      <div v-for="cat in categories" :key="cat.id" class="bg-white rounded-xl border border-gray-100 p-4">

        <!-- Category header -->
        <div class="flex items-center gap-2 mb-3">
          <Icon :name="cat.icon" :size="14" class="text-gray-400 flex-none" />
          <span class="text-[13px] font-medium text-gray-700">{{ cat.name }}</span>
          <span class="font-mono text-[11px] text-gray-400">{{ cat.skills.length }}</span>
        </div>

        <!-- Skills -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="skill in cat.skills"
            :key="skill"
            class="inline-flex items-center h-8 px-3 rounded-full text-[13px] font-[450] border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-[120ms] cursor-pointer font-[inherit]"
          >
            {{ skill }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const categories = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    icon: 'lucide:layers',
    skills: ['Networking', 'HTTP & APIs', 'Auth', 'Concurrency', 'Data structures'],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: 'lucide:monitor',
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'State management', 'Forms', 'API integration', 'Performance', 'Accessibility', 'Browser behavior', 'Testing UI', 'Frontend security'],
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: 'lucide:server',
    skills: ['APIs', 'Databases', 'Queues & Messaging', 'Caching', 'Background jobs', 'Integrations'],
  },
  {
    id: 'systems',
    name: 'Systems',
    icon: 'lucide:cpu',
    skills: ['Scalability', 'Reliability', 'Observability', 'Latency', 'Failure modes', 'Tradeoffs'],
  },
  {
    id: 'code-quality',
    name: 'Code Quality',
    icon: 'lucide:check-circle',
    skills: ['Testing', 'Refactoring', 'Code review', 'Maintainability', 'Technical debt'],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: 'lucide:cloud',
    skills: ['Deployments', 'CI/CD', 'Containers', 'AWS basics', 'Monitoring', 'Incidents'],
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'lucide:shield',
    skills: ['Authentication', 'Authorization', 'Secrets', 'Input validation', 'OWASP', 'Data privacy'],
  },
  {
    id: 'ai-engineering',
    name: 'AI-era Engineering',
    icon: 'lucide:sparkles',
    skills: ['Reviewing AI code', 'Prompting for implementation', 'Validating outputs', 'AI debugging'],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: 'lucide:message-circle',
    skills: ['Explaining tradeoffs', 'Incident updates', 'Product conversations', 'Mentoring', 'Architecture proposals'],
  },
]

const totalSkills = computed(() => categories.reduce((sum, c) => sum + c.skills.length, 0))
</script>
