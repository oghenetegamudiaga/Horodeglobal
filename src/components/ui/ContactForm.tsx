"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Full Name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().optional(),
  source: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormInputs = z.infer<typeof contactFormSchema>;

function ContactFormInner() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams ? searchParams.get("service") || "" : "";

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      budget: "",
      message: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...selectedFiles, ...newFiles];

    if (combinedFiles.length > 2) {
      setFileError("Maximum 2 files allowed for attachment.");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds 5MB size limit.`);
        return;
      }
    }

    setSelectedFiles(combinedFiles);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const onSubmit = async (data: ContactFormInputs) => {
    setSubmitStatus("submitting");
    setStatusMessage("");
    setFileError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.source) formData.append("source", data.source);
      if (data.budget) formData.append("budget", data.budget);
      if (data.message) formData.append("message", data.message);
      if (serviceSlug) formData.append("service_context", serviceSlug);

      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setStatusMessage(
          result.message ||
            "Thank you! Your message has been received. We will get back to you shortly."
        );
        reset();
        setSelectedFiles([]);
      } else {
        setSubmitStatus("error");
        setStatusMessage(
          result.error ||
            "Something went wrong submitting your request. Please try again."
        );
      }
    } catch (err: any) {
      setSubmitStatus("error");
      setStatusMessage(
        err.message || "Network error. Please check your connection and try again."
      );
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="contact-form p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[24px] max-sm:rounded-[18px]">
        <div className="flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#060606] mb-2">
              Submission Received!
            </h3>
            <p className="text-[#4f4f55] text-[14px] leading-relaxed mb-4">
              {statusMessage}
            </p>
            {serviceSlug && (
              <p className="text-[13px] text-[#8b8b92] mb-4">
                Service Context:{" "}
                <span className="font-medium text-[#232327]">{serviceSlug}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmitStatus("idle");
              setStatusMessage("");
            }}
            className="submit-button tega-btn tega-btn-outline text-[13px] px-[20px] py-[10px] cursor-pointer"
          >
            Submit another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="contact-form p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[20px] max-sm:rounded-[18px]"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {serviceSlug && (
        <div className="mb-[18px] p-[12px_16px] bg-[#fafafa] border border-dashed border-[#d4d4d7] rounded-[10px] text-[13px] text-[#4f4f55]">
          Inquiry regarding:{" "}
          <span className="font-semibold text-[#060606]">{serviceSlug}</span>
        </div>
      )}

      <label className="block mb-[18px]">
        <span className="sr-only">Full Name*</span>
        <input
          type="text"
          placeholder="Full Name*"
          {...register("name")}
          className={`w-full h-[60px] px-[22px] border border-dashed ${
            errors.name ? "border-red-500" : "border-[#d4d4d7]"
          } rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]`}
        />
        {errors.name && (
          <span className="text-red-500 text-[12px] mt-1 block">
            {errors.name.message}
          </span>
        )}
      </label>

      <label className="block mb-[18px]">
        <span className="sr-only">Email*</span>
        <input
          type="email"
          placeholder="Email*"
          {...register("email")}
          className={`w-full h-[60px] px-[22px] border border-dashed ${
            errors.email ? "border-red-500" : "border-[#d4d4d7]"
          } rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]`}
        />
        {errors.email && (
          <span className="text-red-500 text-[12px] mt-1 block">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="phone-field block mb-[18px]">
        <span className="sr-only">Phone</span>
        <input
          type="tel"
          placeholder="🇺🇸  +1 Phone"
          {...register("phone")}
          className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
        />
      </label>

      <div className="form-row grid grid-cols-2 gap-[18px] mb-[18px] max-sm:grid-cols-1">
        <label className="block">
          <span className="sr-only">How did you hear about us</span>
          <select
            {...register("source")}
            className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#232327] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
          >
            <option value="">How did you hear about us</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
            <option value="Google Search">Google Search</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>
        </label>

        <label className="block">
          <span className="sr-only">What is your budget</span>
          <select
            {...register("budget")}
            className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#232327] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
          >
            <option value="">What is your budget</option>
            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000+">$10,000+</option>
          </select>
        </label>
      </div>

      <label className="block mb-[18px]">
        <span className="sr-only">Message</span>
        <textarea
          rows={7}
          placeholder="Message"
          {...register("message")}
          className="w-full min-h-[170px] p-[24px_22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none resize-y placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5"
        ></textarea>
      </label>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-[18px] flex flex-wrap gap-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f6] border border-[#e8e8ea] rounded-[8px] text-[12px] text-[#323236]"
            >
              <span className="truncate max-w-[180px]">{file.name}</span>
              <span className="text-[#8b8b92]">
                ({(file.size / (1024 * 1024)).toFixed(1)}MB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-[#8b8b92] hover:text-red-600 font-bold ml-1"
                aria-label={`Remove file ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {fileError && (
        <p className="text-red-500 text-[12px] mb-[18px]">{fileError}</p>
      )}

      <div className="form-actions flex items-center justify-between gap-[18px] mt-[28px] max-sm:flex-col max-sm:items-start">
        <label className="file-link inline-flex items-center gap-[7px] text-[#9999a0] text-[13px] cursor-pointer hover:text-[#232327] transition-colors">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={selectedFiles.length >= 2 || submitStatus === "submitting"}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
          />
          <span aria-hidden="true">◎</span> Attach files (2 Files max - 5MB each)
        </label>
        <button
          className="submit-button tega-btn tega-btn-outline min-w-[112px] px-[23px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={submitStatus === "submitting"}
        >
          {submitStatus === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </div>

      {submitStatus === "error" && (
        <div className="mt-[18px] p-[12px_16px] bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-[13px]">
          {statusMessage}
        </div>
      )}
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense
      fallback={
        <div className="contact-form p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[20px] max-sm:rounded-[18px] animate-pulse">
          <div className="h-10 bg-gray-100 rounded mb-4"></div>
          <div className="h-10 bg-gray-100 rounded mb-4"></div>
          <div className="h-24 bg-gray-100 rounded mb-4"></div>
        </div>
      }
    >
      <ContactFormInner />
    </Suspense>
  );
}
