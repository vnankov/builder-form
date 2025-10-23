
const DOMAIN = 'http://localhost:4000'
const FIELDS_API = '/api/fields'
export const FieldService = {
  async saveField(data: any) {
    console.log('Sending data to backend:', data);

    try {
      const res = await fetch(`${DOMAIN}${FIELDS_API}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },
};