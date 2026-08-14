import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function GiftBlock({ data, config }: { data: any, config: any }) {
  const gifts = data?.step3?.gifts || [
    { bankName: "BCA", accountNumber: "1234567890", accountName: "Romeo Montague" },
    { bankName: "Mandiri", accountNumber: "0987654321", accountName: "Juliet Capulet" }
  ];

  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-white',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
            Wedding Gift
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-3xl">
          {gifts.map((gift: any, idx: number) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col items-center w-full">
              <h3 className="font-sans text-2xl font-bold text-gray-800 tracking-wider mb-6">{gift.bankName}</h3>
              
              <div className="space-y-2 mb-8 w-full border-y border-gray-200 py-6">
                <p className="font-mono text-xl tracking-widest text-gray-900">{gift.accountNumber}</p>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">a.n {gift.accountName}</p>
              </div>

              <button 
                className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-brand-500 transition-colors text-sm uppercase tracking-widest shadow-md"
                onClick={() => navigator.clipboard.writeText(gift.accountNumber)}
              >
                Salin Rekening
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
