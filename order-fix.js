document.addEventListener("submit", async (event) => {
  const form = event.target.closest?.("#order-form");
  if (!form) return;

  // Take over before the legacy handler so only one clean submission is sent.
  event.preventDefault();
  event.stopImmediatePropagation();

  const submitButton = form.querySelector("#submit-order");
  const status = form.querySelector("#form-status");
  if (form.dataset.submitting === "true" || form.dataset.submitted === "true") return;

  // Create a five-digit reference for this submission, then capture the payload
  // before disabling controls; disabled fields are omitted by FormData.
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);
  const referenceCode = String(10000 + (randomValue[0] % 90000));
  const formData = new FormData(form);
  formData.delete("_gotcha");
  formData.set("order_reference", referenceCode);
  formData.set("_subject", `Retail Order Request #${referenceCode}`);

  const controls = [...form.querySelectorAll("input, select, textarea, button")];
  const priorDisabled = new Map(controls.map(control => [control, control.disabled]));

  form.dataset.submitting = "true";
  form.setAttribute("aria-busy", "true");
  controls.forEach(control => { control.disabled = true; });
  if (submitButton) submitButton.textContent = "Sending…";
  if (status) {
    status.textContent = "Sending your order request—this form is temporarily locked. Do not close this page.";
    status.dataset.state = "sending";
  }

  try {
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

    form.dataset.submitting = "false";
    form.dataset.submitted = "true";
    form.removeAttribute("aria-busy");
    form.innerHTML = `
      <section class="order-success" role="status" aria-live="polite" style="text-align:center;padding:40px 20px;">
        <h2 style="margin-bottom:18px;">Order request received.</h2>
        <p style="font-size:1.15rem;font-weight:800;margin-bottom:12px;">Submission complete—this form is now locked.</p>
        <p style="margin:20px 0 8px;font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">Your order reference</p>
        <div aria-label="Order reference ${referenceCode}" style="display:inline-block;padding:14px 24px;margin-bottom:18px;border:3px solid #e65300;border-radius:12px;background:#fff7ed;color:#102b53;font-size:2rem;font-weight:900;letter-spacing:.18em;">${referenceCode}</div>
        <p style="font-size:1.05rem;font-weight:800;margin-bottom:10px;">Reference this code when your payment link is sent.</p>
        <p style="font-size:1rem;margin-bottom:10px;">Your request cannot be edited or submitted again from this page.</p>
        <p>We will email or text you to confirm availability and send the payment link.</p>
      </section>`;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error("Retail order submission failed:", error);
    form.dataset.submitting = "false";
    form.removeAttribute("aria-busy");
    controls.forEach(control => { control.disabled = priorDisabled.get(control); });
    if (submitButton) submitButton.textContent = "Submit Order Request";
    if (status) {
      status.textContent = `NOT RECEIVED. The order request could not be sent. ${error?.message || "Please check your information and try again."}`;
      status.dataset.state = "error";
    }
  }
}, true);
