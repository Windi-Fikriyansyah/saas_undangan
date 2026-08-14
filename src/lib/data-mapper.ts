import { ClientFormData } from "@/lib/validations/client-form";
import set from "lodash/set";
import merge from "lodash/merge";

// Helper to format date "YYYY-MM-DD" into "DD MMMM YYYY" (e.g. 24 Agustus 2026)
function formatDateFriendly(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

// Helper to format date "YYYY-MM-DD" into "DD.MM.YYYY" (e.g. 24.08.2026)
function formatDateShort(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}.${m}.${date.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

export function mapClientDataToWeddingData(formData: any) {
  // Gracefully handle undefined or partial formData
  const step1 = formData?.step1 || {};
  const step2 = formData?.step2 || {};
  const step3 = formData?.step3 || {};
  const step4 = formData?.step4 || {};

  const brideNickname = step1.brideNickname || "Wanita";
  const groomNickname = step1.groomNickname || "Pria";

  const baseData = {
    couple: {
      bride: brideNickname,
      brideFullName: step1.brideName || "",
      brideParents: step1.brideParents || "",
      brideIg: step1.brideIg || "",
      groom: groomNickname,
      groomFullName: step1.groomName || "",
      groomParents: step1.groomParents || "",
      groomIg: step1.groomIg || "",
      shortName: `${groomNickname} & ${brideNickname}`
    },
    wedding: {
      date: formatDateFriendly(step2.akadDate),
      dateShort: formatDateShort(step2.akadDate),
      location: step2.akadVenue || ""
    },
    events: [
      {
        type: "CEREMONY",
        title: "Akad Nikah",
        date: formatDateFriendly(step2.akadDate),
        time: step2.akadTime || "",
        venue: step2.akadVenue || "",
        address: step2.akadAddress || "",
        mapUrl: step2.gmapsLink || ""
      },
      {
        type: "RECEPTION",
        title: "Resepsi",
        date: formatDateFriendly(step2.resepsiDate),
        time: step2.resepsiTime || "",
        venue: step2.resepsiVenue || "",
        address: step2.resepsiAddress || "",
        mapUrl: step2.gmapsLink || ""
      }
    ],
    gallery: {
      images: (step3.galleryImages || []).map((url: string) => ({ src: url })),
      video: step3.videoLink || "",
      story: step3.loveStory || ""
    },
    extra: {
      bankName: step4.bankName || "",
      bankAccount: step4.bankAccount || "",
      bankAccountName: step4.bankAccountName || "",
      liveStream: step4.liveStreamLink || "",
      quote: step4.quotes || ""
    }
  };

  // If customData exists (from DynamicHtmlFormWizard), unflatten and merge it
  if (formData?.customData) {
    const unflattened = {};
    for (const [key, value] of Object.entries(formData.customData)) {
      set(unflattened, key, value);
    }
    // Deep merge standard payload with unflattened custom payload
    return merge(baseData, unflattened);
  }

  return baseData;
}
