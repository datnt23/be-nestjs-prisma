export type CreateUserProps = {
  email: string;
  password: string;
  roles: string[];
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  code_id: string;
  code_expired: string | Date;
};

export type FindUserProps = {
  id?: number;
  email?: string;
  password?: string;
  roles?: string[];
  first_name?: string;
  last_name?: string;
  full_name?: string;
  display_name?: string;
  code_id?: string;
  code_expired?: string | Date;
};
