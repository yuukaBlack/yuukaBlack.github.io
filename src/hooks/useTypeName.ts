import { TypeEnum } from '../types/const';
import { useRoute } from 'vue-router'

export const useTypeName = () => {
  const router = useRoute();
  return TypeEnum[router.query.type as keyof typeof TypeEnum]
} 