export type ContactEmail = {
  // @todo
};

export type ContactPhoneNumber = {
  countryCode: string, // gb
  digits: string, // the phone number, 07xxxx
  id: string, // uuid
  label: string, // mobile, tel, iphone etc.
  'number': string, // phone number in string, with spaces
};

export type Contact = {
  company: string,
  contactType: string, // 'person'
  department: string,
  emails: ContactEmail[],
  firstName: string,
  id: string, // uuid
  imageAvailable: false,
  jobTitle: string,
  lastName: string,
  middleName: string,
  name: string,
  nickname: string,
  phoneNumbers: ContactPhoneNumber[],
  previousLastName: string,
};
