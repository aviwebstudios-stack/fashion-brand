import { useEffect, useState } from "react";
import api from "../../lib/api";

interface MeasurementsFormProps {
  onBack: () => void;
}

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "date" | "textarea";
  required?: boolean;
}

const GENERAL_FIELDS: FieldConfig[] = [
  { key: "serialNumber", label: "Serial Number" },
  { key: "fullName", label: "Full Name", required: true },
  { key: "phoneNumber", label: "Phone Number", required: true },
  { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
  { key: "fittingDay", label: "Fitting Day", type: "date" },
  { key: "eventDate", label: "Event/Wedding Date", type: "date" },
  { key: "dateMeasured", label: "Date Measured", type: "date", required: true },
  { key: "preferredCommencement", label: "Preferred Commencement" },
  { key: "socialMedia", label: "Social Media" },
  { key: "dueBy", label: "Due By", type: "date" },
  { key: "dataDate", label: "Data Date", type: "date" },
  { key: "deliveryAddress", label: "Delivery Address" },
  { key: "dateCorrected", label: "Date Corrected", type: "date" },
  { key: "measurementTakenBy", label: "Measurement Taken By" },
  { key: "qualityControlBy", label: "Quality Control By" },
];

const DETAIL_FIELDS: FieldConfig[] = [
  { key: "shoulder", label: "Shoulder" },
  { key: "shoulderCircumference", label: "Shoulder Circumference" },
  { key: "bust", label: "Bust" },
  { key: "shoulderToBustPoint", label: "Shoulder to Bust Point" },
  { key: "bustPointToBustPoint", label: "Bust Point to Bust Point" },
  { key: "shoulderToUnderBust", label: "Shoulder to Under Bust" },
  { key: "underBustCircumference", label: "Under Bust Circumference" },
  { key: "halfLength", label: "Half Length" },
  { key: "waistCircumference", label: "Waist Circumference" },
  { key: "shoulderToNavel", label: "Shoulder to Navel" },
  { key: "shoulderToLowerAbdomen", label: "Shoulder to Lower Abdomen" },
  { key: "lowerAbdomenCircumference", label: "Lower Abdomen Circumference" },
  { key: "blouseLength", label: "Blouse Length" },
  { key: "hip", label: "Hip" },
  { key: "shoulderToKneeLength", label: "Shoulder to Knee Length" },
  { key: "waistToKnee", label: "Waist to Knee" },
  { key: "kneeCircumferenceDuo", label: "Knee Circumference (Duo)" },
  { key: "kneeCircumference1", label: "Knee Circumference (1)" },
  { key: "shoulderToAnkle", label: "Shoulder to Ankle" },
  { key: "waistToAnkle", label: "Waist to Ankle" },
  { key: "shortDressLength", label: "Short Dress Length" },
  { key: "midiDressLength", label: "Midi Dress Length" },
  { key: "longDressLength", label: "Long Dress Length" },
  { key: "longSkirtLength", label: "Long Skirt Length" },
  { key: "shortSkirtLength", label: "Short Skirt Length" },
  { key: "midiSkirtLength", label: "Midi Skirt Length" },
  { key: "sleeveLength", label: "Sleeve Length" },
  { key: "sleeveWidth", label: "Sleeve Width" },
  { key: "acrossBack", label: "Across Back" },
  { key: "acrossFront", label: "Across Front" },
  { key: "thigh", label: "Thigh" },
];

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-brand-text">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={field.type === "date" ? "date" : "text"}
        required={field.required}
        value={value || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="mt-1 w-full border border-brand-text/20 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
      />
    </div>
  );
}

export default function MeasurementsForm({ onBack }: MeasurementsFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        const detail = res.data.data?.measurementsDetail;
        if (detail) {
          const { notes: existingNotes, ...rest } = detail;
          setValues(rest || {});
          setNotes(existingNotes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.patch("/users/me/measurements-detail", { ...values, notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // silently fail for now
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5">
        <button
          onClick={onBack}
          className="text-sm text-brand-accent hover:underline"
        >
          Return to Account Details
        </button>
      </div>

      <h1 className="text-center font-heading text-2xl tracking-[0.1em] text-brand-text">
        MY MEASUREMENTS
      </h1>

      {loading ? (
        <p className="mt-10 px-6 text-sm text-brand-text/60">Loading...</p>
      ) : (
        <div className="mt-8 space-y-8 px-6 pb-10">
          <section>
            <h2 className="border-b border-brand-text/15 pb-2 text-xs uppercase tracking-[0.15em] text-brand-accent">
              {" "}
              General Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {GENERAL_FIELDS.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  onChange={handleChange}
                />
              ))}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-brand-text">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-brand-text/20 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
              />
            </div>
          </section>

          <section>
            <h2 className="border-b border-[#2b2b26]/15 pb-2 text-xs uppercase tracking-[0.15em] text-[#c9a227]">
              Detailed Measurements
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DETAIL_FIELDS.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {saved && (
            <p className="border border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5 text-sm text-brand-text">
              Measurements saved successfully.
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Measurements"}
          </button>
        </div>
      )}
    </div>
  );
}
