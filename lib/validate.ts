import { z } from 'zod';

const FORM_DATA_SCHEMA = {
  required: z.string().nonempty('FORM_ERROR_REQUIRED'),
  // Form search header
  valueSearch: z.string().nonempty('FORM_ERROR_SEARCH_EMPTY'),

  // Form newsletter
  email: z.string().email('FORM_VAL_EMAIL'),
  gender: z.string(),

  // Form comment
  comment: z.string().nonempty('FORM_VAL_COMMENT'),
  full_name: z.string().nonempty('FORM_VAL_FULL_NAME'),

  // Form login
  phone: z.string().nonempty('FORM_VAL_PHONE'),
  password: z
    .string()
    .nonempty('FORM_VAL_PASSWORD')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'FORM_VAL_PASSWORD_REGEX',
    )
    .min(6, 'FORM_VAL_PASSWORD_MIN')
    .max(20, 'FORM_VAL_PASSWORD_MAX'), 
  password_option: z.string().optional(),
  password_login: z.string().nonempty('FORM_VAL_PASSWORD'),

  // Form service
  date: z.string().nonempty('FORM_VAL_DATE'),
  file: z.string().nonempty('FORM_VAL_FILE'),

  // Form ad`dress
  city: z.string().nonempty('FORM_VAL_CITY'),
  district: z.string().nonempty('FORM_VAL_DISTRICT'),
  ward: z.string().nonempty('FORM_VAL_WARD'),
  address: z.string().nonempty('FORM_VAL_ADDRESS'),

  // Form password
  password_current: z
    .string()
    .nonempty('FORM_VAL_PASSWORD')
    .min(8, 'FORM_VAL_PASSWORD_MIN')
    .max(20, 'FORM_VAL_PASSWORD_MAX'),
  new_password: z
    .string()
    .nonempty('FORM_VAL_PASSWORD_NEW')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'FORM_VAL_PASSWORD_REGEX',
    )
    .min(8, 'FORM_VAL_PASSWORD_MIN')
    .max(20, 'FORM_VAL_PASSWORD_MAX'),
  passwordConfirm: z.string().nonempty('FORM_VAL_PASSWORD'),
  password_new_confirmation: z
    .string()
    .nonempty('FORM_VAL_PASSWORD_CONFIRM')
    .max(20, 'FORM_VAL_PASSWORD_MAX'),

  // Form address
  city_code: z.string().nonempty('FORM_VAL_CITY'),
  district_code: z.string().nonempty('FORM_VAL_DISTRICT'),
  ward_code: z.string().nonempty('FORM_VAL_WARD'),

  // Form bussiness
  id_number: z
    .string()
    .nonempty('FORM_VAL_ID_NUMBER')
    .regex(/^[0-9]+$/, 'FORM_VAL_ID_NUMBER_REGEX')
    .min(12, 'FORM_VAL_ID_NUMBER'),

  tax_number: z
    .string()
    // .nonempty('FORM_VAL_TAX_NUMBER')
    .regex(/^[0-9]+$/, 'FORM_VAL_TAX_NUMBER_REGEX'),
  bank_account_name: z.string(),
  account_bank_number: z.string(),
  bank_branch: z.string(),
  bank_name: z.string(),
};

export default FORM_DATA_SCHEMA;
