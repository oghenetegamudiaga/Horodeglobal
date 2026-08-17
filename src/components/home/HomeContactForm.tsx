"use client";

import React, { useState } from "react";

export function HomeContactForm() {
  const [formNote, setFormNote] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormNote("Thanks. Your request is ready to connect to a backend.");
  };

  return (
    <form
      className="contact-form p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[20px] max-sm:rounded-[18px]"
      onSubmit={handleSubmit}
    >
      <label className="block mb-[18px]">
        <span className="sr-only">Full Name*</span>
        <input
          type="text"
          name="name"
          required
          placeholder="Full Name*"
          className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
        />
      </label>

      <label className="block mb-[18px]">
        <span className="sr-only">Email*</span>
        <input
          type="email"
          name="email"
          required
          placeholder="Email*"
          className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
        />
      </label>

      <label className="phone-field block mb-[18px]">
        <span className="sr-only">Phone</span>
        <input
          type="tel"
          name="phone"
          placeholder="🇺🇸  +1 Phone"
          className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
        />
      </label>

      <div className="form-row grid grid-cols-2 gap-[18px] mb-[18px] max-sm:grid-cols-1">
        <label className="block">
          <span className="sr-only">How did you hear about us</span>
          <select
            name="source"
            className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
          >
            <option value="">How did you hear about us</option>
            <option>Instagram</option>
            <option>Referral</option>
            <option>Google Search</option>
            <option>LinkedIn</option>
          </select>
        </label>

        <label className="block">
          <span className="sr-only">What is your budget</span>
          <select
            name="budget"
            className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
          >
            <option value="">What is your budget</option>
            <option>$1,000 - $5,000</option>
            <option>$5,000 - $10,000</option>
            <option>$10,000+</option>
          </select>
        </label>
      </div>

      <label className="block mb-[18px]">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={7}
          placeholder="Message"
          className="w-full min-h-[170px] p-[24px_22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none resize-y placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5"
        ></textarea>
      </label>

      <div className="form-actions flex items-center justify-between gap-[18px] mt-[28px] max-sm:flex-col max-sm:items-start">
        <label className="file-link inline-flex items-center gap-[7px] text-[#9999a0] text-[13px] cursor-pointer">
          <input type="file" multiple className="hidden" />
          <span aria-hidden="true">◎</span> Attach files (2 Files max - 5MB each)
        </label>
        <button
          className="submit-button tega-btn tega-btn-outline min-w-[112px] px-[23px] cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </div>

      {formNote && (
        <p
          className="form-note min-h-[18px] mt-[14px] mb-0 text-[#4f4f55] text-[12px]"
          aria-live="polite"
        >
          {formNote}
        </p>
      )}
    </form>
  );
}
