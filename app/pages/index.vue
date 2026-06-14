<template>
  <div style="font-family:'Hanken Grotesk',ui-sans-serif,system-ui,sans-serif;color:#1C1C2E;overflow-x:hidden;">

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
          Your engineering sparring partner for staying <span style="background:linear-gradient(120deg,#3A3DC4,#6D6FE8);-webkit-background-clip:text;background-clip:text;color:transparent;">technically sharp.</span>
        </h1>
        <div style="max-width:480px;margin:0 auto 36px;text-align:left;padding:20px 24px;border-left:2px solid #3A3DC4;background:rgba(58,61,196,0.04);border-radius:0 10px 10px 0;">
<p style="font-size:15px;line-height:1.7;color:#5A5A78;margin:0 0 12px;font-style:italic;">
            After more than a decade in software engineering, I realized that staying technically sharp is a continuous challenge. There is always a new technology to explore, a concept to revisit, or a skill to strengthen. I built Flowiz to give engineers a practical way to learn, practice, and keep growing through focused daily sessions and real engineering challenges.
          </p>
          <span style="font-size:13px;font-weight:600;color:#8888AA;">Milos, Founder</span>
        </div>

        <div id="waitlist" style="scroll-margin-top:80px;">
          <form v-if="!joined" @submit.prevent="submit" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:480px;margin:0 auto;">
            <input v-model="email" type="email" placeholder="you@work.com" required class="flz-input-light" />
            <button type="submit" :disabled="loading" class="flz-btn">
              {{ loading ? 'Joining…' : 'Join the waitlist' }}
            </button>
          </form>

          <div v-else style="display:inline-flex;align-items:center;gap:11px;padding:16px 22px;background:#fff;border:1px solid #DDE0F5;border-radius:12px;">
            <span style="display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#3A3DC4,#6D6FE8);flex-shrink:0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span style="font-weight:600;font-size:15px;color:#1C1C2E;">{{ alreadyJoined ? "You're already on the list." : "You're on the list. We'll reach out before launch." }}</span>
          </div>

          <p v-if="error" style="margin-top:10px;font-size:13px;color:#c63f3c;">{{ error }}</p>
          <p style="font-size:13px;color:#9090B0;margin:16px 0 0;">No spam. Just a heads-up when your daily practice is ready.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">

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
  background: radial-gradient(120% 120% at 50% -12%, #EAEBFF 0%, #ffffff 52%);
}

.flz-input-light {
  flex: 1;
  min-width: 240px;
  height: 54px;
  padding: 0 18px;
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  color: #1C1C2E;
  background: #fff;
  border: 1px solid #DDE0F5;
  border-radius: 12px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
}
.flz-input-light::placeholder { color: #A39686; }
.flz-input-light:focus {
  border-color: #3A3DC4;
  box-shadow: 0 0 0 3px rgba(58,61,196,0.22);
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
</style>
