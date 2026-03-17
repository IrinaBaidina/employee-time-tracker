import z from "zod";

export const employeeSchema  = (isNewUser: boolean) => {
  const passwordValidation = z
    .string()
    .min(6, "Новый пароль должен содержать минимум 6 символов")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Пароль может содержать только латинские буквы, цифры и _ без пробелов"
      );

  const baseshema = z.object({
  username: z.string().nonempty(" Поле Логин не может быть пустым").regex(
    /^[a-zA-Z0-9_]+$/,
    "Username может содержать только латинские буквы, цифры и _ без пробелов"
  ),
  newPassword: isNewUser ? passwordValidation : z
      .string()
      .optional()
      .refine((val)=>{
        if(!val || val.trim() === "") return true;
        return passwordValidation.safeParse(val).success;
      },
      {message: "Пароль может должен содержать 6 символов только латинские буквы, цифры и _ без пробелов"}
    ),
    
  confirmPassword: isNewUser 
    ? z.string()
        .min(6, "Подтверждение пароля должно содержать минимум 6 символов")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Пароль может должен содержать 6 символов только латинские буквы, цифры и _ без пробелов"
        )
    : z.string().optional(),
  
  first_name: z.string().nonempty("Поле Имя не может быть пустым"),
  last_name: z.string().nonempty("Поле Фамилия не может быть пустым"),
  middle_name: z.string().max(150, "Отчество должно содержать не более 150 символов"),
  email: z.string(),
  phone: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      return value.replace(/\D/g, "");
    },
    z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val || val === "") return true;
        const isRuPhone = /^[78]\d{10}$/.test(val);
        return isRuPhone;
      }, {
        message: "Введите корректный номер телефона (11 цифр)"
      })
      .transform((val) => val || "")
  ),
  birthdate: z
  .union([z.date(), z.null()])
  .refine((date) => !date || date <= new Date(), {
    message: "Дата не может быть в будущем",
  }),
  hiredate: z.union([z.date(), z.null()]),
  entrydate: z.union([z.date(), z.null()]),
  role: z.string().min(1, "Выберите роль"),
  position: z.string().min(1, "Выберите должность"),
  department: z.string().min(1, "Выберите отдел"),
  payment_tariff: z.coerce
    .string()
    .nonempty("Тариф обязателен")
    .regex(
      /^\d{1,6}(\.\d{1,2})?$/,
      "Тариф должен содержать до 6 цифр до запятой и до 2 после"
    )
    .refine((val) => Number(val) > 0, {
      message: "Тариф должен быть больше 0",
    })
    .transform((val) => Number(val)),
  payment_rate: z.coerce
    .number()
    .gt(0, "Ставка должна быть больше 0")
    .lt(2, "Ставка должна быть меньше 2"),
  payment_group: z.enum(["1", "2"], {
    errorMap: () => ({ message: "Группа выплат должна быть 1 или 2" })
  }),
  director: z.string().optional().or(z.literal("")),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});
return baseshema.refine((data) => {
  if (!isNewUser){
  const hasPassword = !!data.newPassword;
    const hasConfirmPassword = !!data.confirmPassword;
    
    if (hasPassword !== hasConfirmPassword) {
      return false;
    }
    
    if (!hasPassword && !hasConfirmPassword) {
      return true;
    }
  }
  return data.newPassword === data.confirmPassword;
  }, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"]
})

}

export type EmployeeFormValues = z.infer<ReturnType<typeof employeeSchema>> & {
  __authDataBlock?: never;
  __personalInfoBlock?: never;
  __contactsBlock?: never;
  __employmentDatesBlock?: never;
  __positionBlock?: never;
  __payloadBlock?: never;
  __companyStructureBlock?: never;
};