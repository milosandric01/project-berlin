<template>
  <div style="font-family:'Hanken Grotesk',ui-sans-serif,system-ui,sans-serif;color:#1C1714;overflow-x:hidden;">

    <!-- ===================== TOP — LIGHT · WHAT IT IS ===================== -->
    <section class="flz-top" style="position:relative;padding:0 24px 96px;overflow:hidden;">
      <div style="position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:840px;height:620px;border-radius:50%;background:radial-gradient(closest-side, rgba(58,61,196,0.15), rgba(58,61,196,0) 70%);animation:flz-glow 8s ease-in-out infinite;pointer-events:none;"></div>

      <!-- nav -->
      <nav style="position:relative;z-index:5;max-width:1080px;margin:0 auto;display:flex;align-items:center;padding:26px 0;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="display:inline-flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:10px;background:linear-gradient(150deg,#3A3DC4,#6D6FE8);box-shadow:0 6px 16px rgba(58,61,196,0.35);">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M4.5 12 q 3.75 -4.5 7.5 0 t 7.5 0" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/>
            </svg>
          </span>
          <span style="font-family:'Libre Franklin',system-ui,-apple-system,sans-serif;font-weight:700;font-size:22px;letter-spacing:-0.02em;">Flowiz</span>
        </div>
      </nav>

      <!-- hero -->
      <div style="position:relative;z-index:5;max-width:720px;margin:0 auto;text-align:center;padding-top:64px;">
        <h1 style="font-family:'Libre Franklin',system-ui,-apple-system,sans-serif;font-weight:700;font-size:clamp(32px,4.5vw,56px);line-height:1.06;letter-spacing:-0.03em;margin:0 0 20px;">
          Always be <span style="background:linear-gradient(120deg,#3A3DC4,#6D6FE8);-webkit-background-clip:text;background-clip:text;color:transparent;">prepared</span> for your next technical interview.
        </h1>
        <p style="font-size:clamp(16px,1.3vw,18px);line-height:1.65;color:#6E655C;max-width:520px;margin:0 auto 36px;">
          Your daily AI practice assistant that keeps you sharp for any technical interview, when it matters the most.
        </p>

        <div id="waitlist" style="scroll-margin-top:80px;">
          <form v-if="!joined" @submit.prevent="submit" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:480px;margin:0 auto;">
            <input v-model="email" type="email" placeholder="you@work.com" required class="flz-input-light" />
            <button type="submit" :disabled="loading" class="flz-btn">
              {{ loading ? 'Joining…' : 'Join the waitlist' }}
            </button>
          </form>

          <div v-else style="display:inline-flex;align-items:center;gap:11px;padding:16px 22px;background:#fff;border:1px solid #E2D9CB;border-radius:12px;">
            <span style="display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#3A3DC4,#6D6FE8);flex-shrink:0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span style="font-weight:600;font-size:15px;color:#1C1714;">{{ alreadyJoined ? "You're already on the list." : "You're on the list. We'll reach out before launch." }}</span>
          </div>

          <p v-if="error" style="margin-top:10px;font-size:13px;color:#c63f3c;">{{ error }}</p>
          <p style="font-size:13px;color:#A39686;margin:16px 0 0;">No spam. Just a heads-up when your daily practice is ready.</p>
        </div>
      </div>
    </section>

    <!-- ===================== BOTTOM — DARK · THE PROBLEM ===================== -->
    <section style="position:relative;background:radial-gradient(130% 120% at 15% 0%, #23243A 0%, #0E0F1A 54%);color:#ECEDF6;padding:88px 24px 72px;overflow:hidden;">
      <div style="position:absolute;bottom:-180px;right:-100px;width:560px;height:560px;border-radius:50%;background:radial-gradient(closest-side, rgba(58,61,196,0.16), rgba(58,61,196,0) 70%);animation:flz-glow 9s ease-in-out infinite;pointer-events:none;"></div>

      <div class="flz-problem-grid" style="position:relative;z-index:5;max-width:1080px;margin:0 auto;">
        <!-- left: the framing -->
        <div>
          <h2 style="font-family:'Libre Franklin',system-ui,-apple-system,sans-serif;font-weight:700;font-size:clamp(26px,3vw,40px);line-height:1.08;letter-spacing:-0.03em;margin:0 0 18px;">
            Five years at one job. Then the layoff.
          </h2>
          <p style="font-size:16px;line-height:1.65;color:#A9AAC4;margin:0 0 32px;">
            Most engineers only practice when they have to. Flowiz helps you stay ready before the pressure hits.
          </p>

          <form v-if="!joined" @submit.prevent="submit" style="display:flex;gap:10px;flex-wrap:wrap;max-width:440px;">
            <input v-model="email" type="email" placeholder="you@work.com" required class="flz-input-dark" />
            <button type="submit" :disabled="loading" class="flz-btn flz-btn-dark">
              {{ loading ? 'Joining…' : 'Join the waitlist' }}
            </button>
          </form>

          <div v-else style="display:inline-flex;align-items:center;gap:11px;padding:16px 22px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);border-radius:12px;">
            <span style="display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#3A3DC4,#6D6FE8);flex-shrink:0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span style="font-weight:600;font-size:15px;color:#ECEDF6;">{{ alreadyJoined ? "You're already on the list." : "You're on the list. We'll reach out before launch." }}</span>
          </div>
        </div>

        <!-- right: the late-night spiral -->
        <div style="display:flex;flex-direction:column;gap:11px;">
          <div
            v-for="(t, i) in thoughts"
            :key="i"
            :style="{ alignSelf:'flex-end', maxWidth:'86%', padding:'10px 14px', background:'#1B1C2C', border:'1px solid #2C2D44', borderRadius:'18px 18px 5px 18px', color:'#A9AAC4', fontSize:'14px', lineHeight:'1.4', fontWeight:'500', transform:`rotate(${t.rot})` }"
          >{{ t.text }}</div>
        </div>
      </div>

      <!-- footer -->
      <footer style="position:relative;z-index:5;max-width:1080px;margin:104px auto 0;padding-top:28px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div style="display:flex;align-items:center;gap:9px;">
          <span style="display:inline-flex;width:26px;height:26px;align-items:center;justify-content:center;border-radius:7px;background:linear-gradient(150deg,#3A3DC4,#6D6FE8);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4.5 12 q 3.75 -4.5 7.5 0 t 7.5 0" stroke="#fff" stroke-width="2.8" stroke-linecap="round" fill="none"/></svg>
          </span>
          <span style="font-family:'Libre Franklin',system-ui,-apple-system,sans-serif;font-weight:700;font-size:16px;color:#ECEDF6;">Flowiz</span>
        </div>
        <span style="font-size:13px;color:#7B7C95;">Stay sharp. Be ready before it matters. © 2026 Flowiz.</span>
      </footer>
    </section>

  </div>
</template>

<script setup lang="ts">
const thoughts = [
  { text: "I haven't interviewed in 5 years.", rot: '-1.1deg' },
  { text: 'Where do I even start?', rot: '0.8deg' },
  { text: 'I should have been preparing.', rot: '-0.6deg' },
  { text: "I don't even know what they ask anymore.", rot: '1deg' },
  { text: "I've been doing the same stack for years.", rot: '-0.8deg' },
  { text: "I'll need weeks to get back up to speed.", rot: '0.7deg' },
  { text: "What if they ask something I haven't touched in months?", rot: '-0.9deg' },
]

const email = ref('')
const loading = ref(false)
const joined = ref(false)
const alreadyJoined = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch<{ ok: boolean, alreadyJoined: boolean }>('/api/waitlist/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })
    alreadyJoined.value = res.alreadyJoined
    joined.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.flz-top {
  background: radial-gradient(120% 120% at 50% -12%, #FFF1E2 0%, #FBF7F0 52%);
}

.flz-input-light {
  flex: 1;
  min-width: 240px;
  height: 54px;
  padding: 0 18px;
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  color: #1C1714;
  background: #fff;
  border: 1px solid #E2D9CB;
  border-radius: 12px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
}
.flz-input-light::placeholder { color: #A39686; }
.flz-input-light:focus {
  border-color: #3A3DC4;
  box-shadow: 0 0 0 3px rgba(58,61,196,0.22);
}

.flz-input-dark {
  flex: 1;
  min-width: 210px;
  height: 54px;
  padding: 0 18px;
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  color: #ECEDF6;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
}
.flz-input-dark::placeholder { color: rgba(169,170,196,0.6); }
.flz-input-dark:focus {
  border-color: #3A3DC4;
  box-shadow: 0 0 0 3px rgba(58,61,196,0.3);
}

.flz-btn {
  height: 54px;
  padding: 0 26px;
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(135deg, #3A3DC4, #6D6FE8);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(58,61,196,0.32);
  transition: transform .15s, opacity .15s;
}
.flz-btn:hover { transform: translateY(-2px); }
.flz-btn:active { transform: translateY(0) scale(.99); }
.flz-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.flz-btn-dark { box-shadow: 0 8px 20px rgba(58,61,196,0.4); }

.flz-problem-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: start;
}

@media (max-width: 768px) {
  .flz-problem-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}
</style>
