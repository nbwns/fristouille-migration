import Airtable from "airtable";

const AIRTABLE_BASE_ID = "appI7jFWaljyfkpVd";

type AirtableSelectOptions = {
  view?: string;
  filterByFormula?: string;
};

export function getAirtableBase(apiKey: string) {
  return new Airtable({ apiKey }).base(AIRTABLE_BASE_ID);
}

export async function fetchAllRecords(
  base: ReturnType<typeof getAirtableBase>,
  tableName: string,
  options: AirtableSelectOptions,
) {
  return new Promise<any[]>((resolve, reject) => {
    const records: any[] = [];

    base(tableName)
      .select(options)
      .eachPage(
        (pageRecords, fetchNextPage) => {
          records.push(...pageRecords);
          fetchNextPage();
        },
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(records);
        },
      );
  });
}
