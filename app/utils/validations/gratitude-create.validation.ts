import * as v from 'valibot'

export const gratitudeCreateValidation = (data: {
  title: string | undefined
  description: string
}): { errors: { title?: string; description?: string } } => {
  const errors: { title?: string; description?: string } = {}
  const titleErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(100, 'Escribe menos.'),
      ),
    ),
    data.title,
  )
  if (titleErr.issues) {
    errors.title = titleErr.issues[0].message
  }
  const descriptionErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.minLength(4, 'Escribe un poco más.'),
      v.maxLength(400, 'Escribe menos.'),
    ),
    data.description,
  )
  if (descriptionErr.issues) {
    errors.description = descriptionErr.issues[0].message
  }
  if (Object.keys(errors).length > 0) {
    return { errors }
  }
  return { errors: {} }
}
