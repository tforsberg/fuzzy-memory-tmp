export interface Lesson {
  id:string;
  status:  'draft'  | 'processing' | 'error' | 'ready' |  'published';
  sectionId:string;
  seqNo:string;
  title:string;
  description?:string;
  videoFileName:string;
  videoDuration:number;
  thumbnail: string;
  duration:number;
  free: boolean;
}

