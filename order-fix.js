document.addEventListener("submit", async (event) => {
  const form = event.target.closest?.("#order-form");
  if (!form) return;

  // Take over before the legacy submit handler so Formspree receives a clean payload.
  event.preventDefault();
  event.stopImmediatePropagation();

  const submitButton = form.querySelector("#submit-order");
  const status = form.querySelector("#form-status");

  if (submitButton?.disabled) return;

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  if (status) status.textContent = "Submitting your order request…";

  try {
    const formData = new FormData(form);
    // Formspree silently discards a submission when _gotcha contains anything.
    // Do not send that field at all from the retail checkout.
    formData.delete("_gotcha");
    formData.set("_subject", "Retail Order Request");

    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      let message = "Submission failed";
      try {
        const body = await response.json();
        if (body?.errors?.length) message = body.errors.map(error => error.message).join(" ");
      } catch (_) {}
      throw new Error(message);
    }

    form.innerHTML = `
      <section class="order-success" role="status" aria-live="polite" style="text-align:center;padding:40px 20px;">
        <h2 style="margin-bottom:18px;">Order submitted successfully.</h2>
        <p style="font-size:1.15rem;font-weight:700;margin-bottom:12px;">Your order has not been placed yet.</p>
        <p style="font-size:1.05rem;">We will email or text a link for payment.</p>
      </section>`;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error("Retail order submission failed:", error);
    if (status) status.textContent = `The order request could not be sent. ${error?.message || "Please try again."}`;
    submitButton.disabled = false;
    submitButton.textContent = "Submit Order Request";
  }
}, true);
