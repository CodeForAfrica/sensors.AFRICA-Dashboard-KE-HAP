(async function () {
    if (!localStorage.getItem("nextauth.message")?.clientId) {
        document.location.href="/";
      };
// Todo verify Token via API
})();
