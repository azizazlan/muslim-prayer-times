interface HadithProp {
  status: string;
  volume: string;
  hadithNumber: string;
  headingEnglish: string;
  hadithEnglish: string;
  book: {
    bookName: string;
    writerName: string;
  };
  chapter: {
    id: string;
    chapterEnglish: string;
  };
  // Add other properties as needed
}

interface HadithApiResponse {
  status: number;
  hadiths: {
    data: HadithProp[];
  };
}

export { HadithApiResponse, HadithProp };