interface SizeGuideModalProps {
  onClose: () => void;
}

interface TableSection {
  title: string;
  headers: string[];
  rows: { label: string; values: string[] }[];
}

const SECTIONS: TableSection[] = [
  {
    title: "Dress Size - Regular - Inches",
    headers: ["UK", "6", "8", "10", "12", "14", "16", "18", "20", "22"],
    rows: [
      { label: "EU", values: ["34", "36", "38", "40", "42", "44", "46", "48", "50"] },
      { label: "US", values: ["2", "4", "6", "8", "10", "12", "14", "16", "18"] },
      { label: "Size", values: ["S", "S", "M", "M", "L", "L", "XL", "XXL", "XXXL"] },
      { label: "Bust", values: ["34.2", "36.2", "38.1", "40.1", "42.1", "44", "46", "48", "50"] },
      { label: "Waist", values: ["24.4", "26.3", "28.3", "30.3", "32.2", "34.2", "36.2", "38.2", "40"] },
      { label: "Hip", values: ["38.1", "40.1", "42.1", "44", "46", "46", "50", "52", "54"] },
    ],
  },
  {
    title: "Dress Size - Regular - CM",
    headers: ["UK", "6", "8", "10", "12", "14", "16", "18", "20", "22"],
    rows: [
      { label: "EU", values: ["34", "36", "38", "40", "42", "44", "46", "48", "50"] },
      { label: "US", values: ["2", "4", "6", "8", "10", "12", "14", "16", "18"] },
      { label: "Size", values: ["S", "S", "M", "M", "L", "L", "XL", "XXL", "XXXL"] },
      { label: "Bust", values: ["87", "92", "97", "102", "107", "112", "117", "122", "127"] },
      { label: "Waist", values: ["62", "67", "72", "77", "82", "87", "92", "97", "102"] },
      { label: "Hip", values: ["97", "102", "107", "112", "117", "122", "127", "132", "137"] },
    ],
  },
  {
    title: "Dress Size - Curvy - Inches",
    headers: ["Size", "XS", "S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Bust", values: ["35", "37.4", "40", "42", "44", "46.7"] },
      { label: "Waist", values: ["24", "26", "28.7", "31", "33", "35.8"] },
      { label: "Hip", values: ["40", "42", "44.4", "46", "49", "51.5"] },
    ],
  },
  {
    title: "Dress Size - Curvy - CM",
    headers: ["Size", "XS", "S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Bust", values: ["89", "95", "101", "107", "113", "119"] },
      { label: "Waist", values: ["61", "67", "73", "79", "85", "91"] },
      { label: "Hip", values: ["101", "107", "113", "119", "129", "131"] },
    ],
  },
  {
    title: "Pants - Regular - Inches",
    headers: ["Size", "XS", "S", "S", "M", "M", "L", "L", "XL", "XXL"],
    rows: [
      { label: "UK", values: ["6", "8", "10", "12", "14", "16", "18", "20"] },
      { label: "Waist", values: ["22", "24", "26", "28", "30", "32", "34", "36", "38"] },
      { label: "Hip", values: ["35", "37", "39", "41", "43", "45", "47", "49", "51"] },
    ],
  },
  {
    title: "Pants - Regular - CM",
    headers: ["Size", "XS", "S", "S", "M", "M", "L", "L", "XL", "XXL"],
    rows: [
      { label: "UK", values: ["6", "8", "10", "12", "14", "16", "18", "20"] },
      { label: "Waist", values: ["57", "62", "67", "72", "77", "82", "87", "92", "97"] },
      { label: "Hip", values: ["89", "94", "99", "104", "109", "114", "119.5", "124.5", "129.5"] },
    ],
  },
  {
    title: "Pants - Curvy - Inches",
    headers: ["Size", "XS", "S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Waist", values: ["23", "25", "28", "31", "34", "37"] },
      { label: "Hip", values: ["40", "42.5", "45", "47.5", "50", "52.5"] },
    ],
  },
  {
    title: "Pants - Curvy - CM",
    headers: ["Size", "XS", "S", "M", "L", "XL", "XXL"],
    rows: [
      { label: "Waist", values: ["62", "67", "74", "82", "92", "97"] },
      { label: "Hip", values: ["102", "108", "114", "121", "127", "134"] },
    ],
  },
  {
    title: "Corseted Blouses - Regular",
    headers: ["Size", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
    rows: [
      { label: "", values: ["XS", "S", "S", "M", "M", "L", "L", "XL", "XXL", "XXXL", "XXXXL"] },
      { label: "Bust", values: ["32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52"] },
      { label: "Waist", values: ["23", "26", "29", "31", "33", "35", "37", "39", "41", "43", "45"] },
    ],
  },
];

export default function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-brand-bg p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="sticky left-full top-0 -mt-2 -mr-2 rounded-full p-1.5 text-brand-text/60 transition hover:bg-black/5 hover:text-brand-text"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="-mt-6 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-lg text-brand-text">{section.title}</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[400px] border-collapse text-sm">
                  <thead>
                    <tr>
                      {section.headers.map((h, i) => (
                        <th
                          key={i}
                          className="border border-brand-text/15 bg-brand-bg px-3 py-2 text-left font-medium text-brand-text"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-brand-text/15 px-3 py-2 font-medium text-brand-text">
                          {row.label}
                        </td>
                        {row.values.map((v, j) => (
                          <td key={j} className="border border-brand-text/15 px-3 py-2 text-brand-text/80">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}