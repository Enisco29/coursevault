-- Create profiles table (user management)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create courses table (parent organization level)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_select_own" ON public.courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "courses_insert_own" ON public.courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "courses_update_own" ON public.courses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "courses_delete_own" ON public.courses FOR DELETE USING (auth.uid() = user_id);

-- Create folders table (nested organization within courses)
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "folders_select" ON public.folders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "folders_insert" ON public.folders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "folders_update" ON public.folders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "folders_delete" ON public.folders FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

-- Create documents table (PDFs)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select" ON public.documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "documents_insert" ON public.documents FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "documents_update" ON public.documents FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

CREATE POLICY "documents_delete" ON public.documents FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.courses WHERE courses.id = course_id AND courses.user_id = auth.uid()
  ));

-- Create indexes for common queries
CREATE INDEX idx_courses_user_id ON public.courses(user_id);
CREATE INDEX idx_folders_course_id ON public.folders(course_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_folder_id);
CREATE INDEX idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX idx_documents_course_id ON public.documents(course_id);
