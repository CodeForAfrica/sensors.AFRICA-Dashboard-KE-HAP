(async function () {
const res = await fetch('/api/auth/session');
const data =  res.ok ? await res.json() : {};
  if (!data.user) {
        document.location.href="/";
      };
})();