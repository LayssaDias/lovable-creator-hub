-- Create subscription plans table (each plan has its own Pix)
CREATE TABLE public.subscription_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  duration_days integer NOT NULL,
  price numeric(10,2) NOT NULL,
  discount_percentage integer DEFAULT 0,
  description text,
  qr_code_image_url text,
  pix_key text,
  beneficiary_name text,
  payment_instructions text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  caption text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create chat settings table
CREATE TABLE public.chat_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  benefits text,
  price numeric(10,2) NOT NULL DEFAULT 29.90,
  qr_code_image_url text,
  pix_key text,
  beneficiary_name text,
  payment_instructions text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create chat users table (users who paid for chat access)
CREATE TABLE public.chat_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  country text NOT NULL,
  cpf text NOT NULL,
  email text NOT NULL,
  nickname text NOT NULL,
  full_name text NOT NULL,
  birth_date date NOT NULL,
  phone text NOT NULL,
  chat_enabled boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Plans viewable by everyone" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for posts
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage posts" ON public.posts FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for chat_settings
CREATE POLICY "Chat settings viewable by everyone" ON public.chat_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage chat settings" ON public.chat_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for chat_users
CREATE POLICY "Users can view their own chat data" ON public.chat_users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat data" ON public.chat_users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all chat users" ON public.chat_users FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage chat users" ON public.chat_users FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_settings_updated_at
  BEFORE UPDATE ON public.chat_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_users_updated_at
  BEFORE UPDATE ON public.chat_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, duration_days, price, discount_percentage, description) VALUES
  ('Semanal', 7, 29.90, 0, 'Acesso por 1 semana'),
  ('Quinzenal', 15, 59.90, 0, 'Acesso por 15 dias'),
  ('Mensal', 30, 109.90, 0, 'Acesso por 1 mês'),

-- Insert default chat settings
INSERT INTO public.chat_settings (benefits, price) VALUES
  ('• Acesso exclusivo ao chat privado
• Resposta prioritária
• Conteúdo exclusivo do chat
• Interação direta com o criador', 49.90);