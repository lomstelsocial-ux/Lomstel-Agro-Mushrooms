import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  LayoutDashboard, 
  ShoppingBag, 
  Image as ImageIcon, 
  HelpCircle, 
  MessageSquareQuote, 
  Settings, 
  Database, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  MessageCircle, 
  ExternalLink, 
  Copy, 
  CheckCheck, 
  LogOut, 
  RefreshCw,
  Eye,
  Save,
  ShieldCheck,
  TrendingUp,
  Users,
  Upload,
  Send,
  Sparkles,
  BookOpen,
  Palette,
  Type,
  EyeOff,
  Lock,
  Share2,
  SlidersHorizontal,
  Video,
  Play,
  Film,
  Youtube
} from 'lucide-react';
import { 
  Order, 
  Product, 
  GalleryItem, 
  FAQItem, 
  Testimonial, 
  SiteSettings, 
  OrderStatus,
  SiteAnalytics,
  CustomerLead,
  SocialLink,
  SocialPlatform,
  ScrollingBannerItem,
  VideoItem
} from '../../types';
import { 
  DataService, 
  isSupabaseConfigured, 
  supabaseUrl, 
  supabaseAnonKey, 
  testSupabaseConnection 
} from '../../services/supabase';
import { LomstelLogo } from '../common/LomstelLogo';
import { SocialIcon } from '../common/SocialIcon';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { 
  extractYouTubeId, 
  isValidYouTubeUrl, 
  getYouTubeThumbnailUrl, 
  getYouTubeEmbedUrl, 
  getYouTubeWatchUrl 
} from '../../utils/youtube';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: (updatedSettings?: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  // Authentication State - strict 'Lomstel@2026' requirement
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lomstel_admin_auth') === 'true';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'orders' | 'analytics' | 'outreach' | 'content' | 'products' | 'gallery' | 'videos' | 'scrolling' | 'faqs' | 'testimonials' | 'branding' | 'social' | 'supabase'
  >('orders');

  // Loaded Application Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [analytics, setAnalytics] = useState<SiteAnalytics>({
    totalPageViews: 142,
    uniqueVisitors: 87,
    totalOrders: 0,
    lastVisitedAt: new Date().toISOString()
  });
  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>([]);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [leadCategoryFilter, setLeadCategoryFilter] = useState<string>('All');

  // Form Editing States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Fresh Mushrooms',
    imageUrl: '',
    caption: ''
  });
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryFilterCategory, setGalleryFilterCategory] = useState<string>('All');
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');

  // Social Links management state
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState<{
    platform: SocialPlatform;
    name: string;
    url: string;
    enabled: boolean;
  }>({
    platform: 'instagram',
    name: '',
    url: '',
    enabled: true
  });

  // Scrolling Image Panel state
  const [isAddingScrolling, setIsAddingScrolling] = useState(false);
  const [editingScrollingItem, setEditingScrollingItem] = useState<ScrollingBannerItem | null>(null);
  const [newScrollingItem, setNewScrollingItem] = useState<{
    title: string;
    caption: string;
    imageUrl: string;
    enabled: boolean;
  }>({
    title: '',
    caption: '',
    imageUrl: '',
    enabled: true
  });

  // Video Showcase state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [adminPreviewVideo, setAdminPreviewVideo] = useState<VideoItem | null>(null);
  const [newVideo, setNewVideo] = useState<{
    title: string;
    youtubeUrl: string;
    category: string;
    description: string;
    duration: string;
    enabled: boolean;
    featured: boolean;
  }>({
    title: '',
    youtubeUrl: '',
    category: 'Farm Tour & Harvest',
    description: '',
    duration: '3:30',
    enabled: true,
    featured: false
  });

  const [sqlCopied, setSqlCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Outreach quick response composer state
  const [selectedLead, setSelectedLead] = useState<CustomerLead | null>(null);
  const [outreachMessage, setOutreachMessage] = useState('');

  // Load all application data
  const loadData = async () => {
    try {
      const [ord, prod, gal, fq, test, set, an, leads] = await Promise.all([
        DataService.getOrders(),
        DataService.getProducts(),
        DataService.getGallery(),
        DataService.getFAQs(),
        DataService.getTestimonials(),
        DataService.getSettings(),
        DataService.getAnalytics(),
        DataService.getCustomerLeads()
      ]);
      setOrders(ord);
      setProducts(prod);
      setGallery(gal);
      setFaqs(fq);
      setTestimonials(test);
      setSettings(set);
      setAnalytics(an);
      setCustomerLeads(leads);
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Strict Login: 'Lomstel@2026' only
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = loginPassword.trim();
    if (clean === 'Lomstel@2026' || clean.toLowerCase() === 'lomstel@2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('lomstel_admin_auth', 'true');
      setLoginError('');
      loadData();
    } else {
      setLoginError('Invalid access key. Please enter the administrator password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('lomstel_admin_auth');
  };

  // Image Upload Handler from anywhere (reads file to base64 DataURL or Supabase Storage)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    targetField: 'hero' | 'hero-dried' | 'about' | 'facility' | 'product' | 'gallery' | 'gallery-edit' | 'scrolling-add' | 'scrolling-edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await DataService.uploadImage(file);

      if (targetField === 'hero' && settings) {
        const updated = { ...settings, heroImage: imageUrl };
        setSettings(updated);
        await DataService.updateSettings(updated);
        if (onRefreshData) onRefreshData(updated);
        setSaveStatus('Fresh Hero image uploaded and applied to home page!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else if (targetField === 'hero-dried' && settings) {
        const updated = { ...settings, heroDriedImage: imageUrl };
        setSettings(updated);
        await DataService.updateSettings(updated);
        if (onRefreshData) onRefreshData(updated);
        setSaveStatus('Dried Mushroom Hero image uploaded and applied to home page!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else if (targetField === 'about' && settings) {
        const updated = { ...settings, aboutImage: imageUrl };
        setSettings(updated);
        await DataService.updateSettings(updated);
        if (onRefreshData) onRefreshData(updated);
        setSaveStatus('About section image uploaded and applied to project!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else if (targetField === 'facility' && settings) {
        const updated = { ...settings, facilityImage: imageUrl };
        setSettings(updated);
        await DataService.updateSettings(updated);
        if (onRefreshData) onRefreshData(updated);
        setSaveStatus('Facility image uploaded and applied to project!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else if (targetField === 'product' && editingProduct) {
        setEditingProduct({ ...editingProduct, image: imageUrl });
      } else if (targetField === 'gallery') {
        setNewGalleryItem((prev) => ({ ...prev, imageUrl }));
      } else if (targetField === 'gallery-edit' && editingGalleryItem) {
        setEditingGalleryItem({ ...editingGalleryItem, imageUrl });
      } else if (targetField === 'scrolling-add') {
        setNewScrollingItem((prev) => ({ ...prev, imageUrl }));
      } else if (targetField === 'scrolling-edit' && editingScrollingItem) {
        setEditingScrollingItem({ ...editingScrollingItem, imageUrl });
      }
    } catch (err) {
      alert('Failed to upload image. Please try a different file.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Order Operations
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await DataService.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      await DataService.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (onRefreshData) onRefreshData();
    }
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'New').length;
  const confirmedCount = orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const socialLinksList = settings?.socialLinks || [];
  const activeSocialLinksCount = socialLinksList.filter(s => s.enabled).length;

  const scrollingImagesList = settings?.scrollingImages || [];
  const scrollingImagesCount = scrollingImagesList.length;
  const activeScrollingImagesCount = scrollingImagesList.filter(s => s.enabled).length;

  const videosList = settings?.videos || [];
  const videosCount = videosList.length;
  const activeVideosCount = videosList.filter(v => v.enabled).length;

  const conversionRate = analytics.uniqueVisitors > 0 
    ? ((totalOrdersCount / analytics.uniqueVisitors) * 100).toFixed(1)
    : '0.0';

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.product.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.delivery_location.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLeads = customerLeads.filter(l => {
    return leadCategoryFilter === 'All' || l.category === leadCategoryFilter;
  });

  // Settings Save
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      const saved = await DataService.updateSettings(settings);
      setSaveStatus('Website content & settings updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
      if (onRefreshData) onRefreshData(saved);
    } catch (e) {
      setSaveStatus('Error saving settings.');
    }
  };

  // Product CRUD
  const handleSaveProduct = async (prod: Product) => {
    await DataService.saveProduct(prod);
    setEditingProduct(null);
    setIsAddingProduct(false);
    await loadData();
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await DataService.deleteProduct(id);
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  // FAQ CRUD
  const handleSaveFaq = async (faq: FAQItem) => {
    await DataService.saveFAQ(faq);
    setEditingFaq(null);
    setIsAddingFaq(false);
    await loadData();
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Delete this FAQ?')) {
      await DataService.deleteFAQ(id);
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Testimonial CRUD
  const handleSaveTestimonial = async (t: Testimonial) => {
    await DataService.saveTestimonial(t);
    setEditingTestimonial(null);
    setIsAddingTestimonial(false);
    await loadData();
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      await DataService.deleteTestimonial(id);
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Gallery CRUD
  const handleAddGalleryItem = async () => {
    if (!newGalleryItem.title?.trim() || !newGalleryItem.imageUrl?.trim()) {
      alert('Please provide at least an image title and upload or paste an image URL.');
      return;
    }
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryItem.title.trim(),
      category: (newGalleryItem.category as any) || 'Fresh Mushrooms',
      imageUrl: newGalleryItem.imageUrl.trim(),
      caption: newGalleryItem.caption?.trim() || ''
    };
    await DataService.saveGalleryItem(item);
    setNewGalleryItem({ title: '', category: 'Fresh Mushrooms', imageUrl: '', caption: '' });
    setIsAddingGallery(false);
    await loadData();
    if (onRefreshData) onRefreshData();
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem({ ...item });
    setIsAddingGallery(false);
  };

  const handleSaveEditedGalleryItem = async () => {
    if (!editingGalleryItem) return;
    if (!editingGalleryItem.title?.trim() || !editingGalleryItem.imageUrl?.trim()) {
      alert('Please provide at least an image title and an image URL or uploaded photo.');
      return;
    }
    await DataService.saveGalleryItem({
      ...editingGalleryItem,
      title: editingGalleryItem.title.trim(),
      imageUrl: editingGalleryItem.imageUrl.trim(),
      caption: editingGalleryItem.caption?.trim() || ''
    });
    setEditingGalleryItem(null);
    await loadData();
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Delete this image from gallery?')) {
      await DataService.deleteGalleryItem(id);
      if (editingGalleryItem?.id === id) {
        setEditingGalleryItem(null);
      }
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Social Media Management Handlers
  const handleAddSocialLink = async () => {
    if (!settings) return;
    if (!newSocialLink.url.trim()) {
      alert('Please enter a URL or link for this social media icon.');
      return;
    }
    const defaultName = newSocialLink.name.trim() || 
      (newSocialLink.platform.charAt(0).toUpperCase() + newSocialLink.platform.slice(1));

    const item: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newSocialLink.platform,
      name: defaultName,
      url: newSocialLink.url.trim(),
      enabled: newSocialLink.enabled
    };

    const updatedSocialLinks = [...(settings.socialLinks || []), item];
    const updatedSettings = { ...settings, socialLinks: updatedSocialLinks };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    setNewSocialLink({ platform: 'instagram', name: '', url: '', enabled: true });
    setIsAddingSocial(false);
    setSaveStatus('Social media icon added successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData();
  };

  const handleUpdateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    if (!settings) return;
    const updatedLinks = (settings.socialLinks || []).map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    const updatedSettings = { ...settings, socialLinks: updatedLinks };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!settings) return;
    if (window.confirm('Delete this social media icon?')) {
      const updatedLinks = (settings.socialLinks || []).filter(link => link.id !== id);
      const updatedSettings = { ...settings, socialLinks: updatedLinks };
      setSettings(updatedSettings);
      await DataService.updateSettings(updatedSettings);
      setSaveStatus('Social media icon deleted.');
      setTimeout(() => setSaveStatus(null), 3000);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleToggleSocialLink = async (id: string) => {
    if (!settings) return;
    const updatedLinks = (settings.socialLinks || []).map(link => 
      link.id === id ? { ...link, enabled: !link.enabled } : link
    );
    const updatedSettings = { ...settings, socialLinks: updatedLinks };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (onRefreshData) onRefreshData();
  };

  // Scrolling Image Panel Handlers
  const handleAddScrollingItem = async () => {
    if (!settings) return;
    if (!newScrollingItem.imageUrl?.trim()) {
      alert('Please upload an image or paste an image URL for the scrolling panel.');
      return;
    }
    const item: ScrollingBannerItem = {
      id: `scroll-${Date.now()}`,
      title: newScrollingItem.title.trim() || 'Lomstel Mushroom Showcase',
      caption: newScrollingItem.caption.trim(),
      imageUrl: newScrollingItem.imageUrl.trim(),
      enabled: newScrollingItem.enabled
    };

    const updated = [...(settings.scrollingImages || []), item];
    const updatedSettings = { ...settings, scrollingImages: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    setNewScrollingItem({ title: '', caption: '', imageUrl: '', enabled: true });
    setIsAddingScrolling(false);
    setSaveStatus('Photo added to scrolling panel successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData();
  };

  const handleSaveEditedScrollingItem = async () => {
    if (!settings || !editingScrollingItem) return;
    if (!editingScrollingItem.imageUrl?.trim()) {
      alert('Please provide an image for this item.');
      return;
    }
    const updated = (settings.scrollingImages || []).map(item => 
      item.id === editingScrollingItem.id ? editingScrollingItem : item
    );
    const updatedSettings = { ...settings, scrollingImages: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    setEditingScrollingItem(null);
    setSaveStatus('Scrolling panel image updated!');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteScrollingItem = async (id: string) => {
    if (!settings) return;
    if (window.confirm('Remove this photo from the auto-scrolling panel?')) {
      const updated = (settings.scrollingImages || []).filter(item => item.id !== id);
      const updatedSettings = { ...settings, scrollingImages: updated };
      setSettings(updatedSettings);
      await DataService.updateSettings(updatedSettings);
      if (editingScrollingItem?.id === id) {
        setEditingScrollingItem(null);
      }
      setSaveStatus('Photo removed from scrolling panel.');
      setTimeout(() => setSaveStatus(null), 3000);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleToggleScrollingItem = async (id: string) => {
    if (!settings) return;
    const updated = (settings.scrollingImages || []).map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    const updatedSettings = { ...settings, scrollingImages: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (onRefreshData) onRefreshData();
  };

  // Video Showcase & YouTube Handlers
  const handleAddVideo = async () => {
    if (!settings) return;
    const trimmedUrl = newVideo.youtubeUrl.trim();
    if (!trimmedUrl) {
      setSaveStatus('Please enter a YouTube video URL or ID.');
      setTimeout(() => setSaveStatus(null), 3500);
      return;
    }
    const ytId = extractYouTubeId(trimmedUrl);
    if (!ytId) {
      setSaveStatus('Invalid YouTube link. Please paste a valid YouTube watch link, youtu.be link, shorts link, or 11-char ID.');
      setTimeout(() => setSaveStatus(null), 4000);
      return;
    }

    const item: VideoItem = {
      id: `vid-${Date.now()}`,
      title: newVideo.title.trim() || 'Lomstel Agro Video Feature',
      youtubeUrl: trimmedUrl,
      category: newVideo.category.trim() || 'Farm Tour & Harvest',
      description: newVideo.description.trim(),
      duration: newVideo.duration.trim() || '3:30',
      enabled: newVideo.enabled,
      featured: newVideo.featured
    };

    let updatedVideos = [...(settings.videos || [])];
    if (item.featured) {
      updatedVideos = updatedVideos.map(v => ({ ...v, featured: false }));
    }
    updatedVideos.push(item);

    const updatedSettings = { ...settings, videos: updatedVideos };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    setNewVideo({
      title: '',
      youtubeUrl: '',
      category: 'Farm Tour & Harvest',
      description: '',
      duration: '3:30',
      enabled: true,
      featured: false
    });
    setIsAddingVideo(false);
    setSaveStatus('YouTube video added and live on the home page!');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData(updatedSettings);
  };

  const handleSaveEditedVideo = async () => {
    if (!settings || !editingVideo) return;
    const trimmedUrl = editingVideo.youtubeUrl.trim();
    if (!trimmedUrl || !extractYouTubeId(trimmedUrl)) {
      setSaveStatus('Please enter a valid YouTube URL or ID.');
      setTimeout(() => setSaveStatus(null), 3500);
      return;
    }

    let updatedVideos = (settings.videos || []).map(v => {
      if (v.id === editingVideo.id) {
        return editingVideo;
      }
      if (editingVideo.featured) {
        return { ...v, featured: false };
      }
      return v;
    });

    const updatedSettings = { ...settings, videos: updatedVideos };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    setEditingVideo(null);
    setSaveStatus('Video details updated successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData(updatedSettings);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!settings) return;
    const updated = (settings.videos || []).filter(v => v.id !== id);
    const updatedSettings = { ...settings, videos: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (editingVideo?.id === id) setEditingVideo(null);
    setSaveStatus('Video removed from showcase.');
    setTimeout(() => setSaveStatus(null), 3000);
    if (onRefreshData) onRefreshData(updatedSettings);
  };

  const handleToggleVideoEnabled = async (id: string) => {
    if (!settings) return;
    const updated = (settings.videos || []).map(v => 
      v.id === id ? { ...v, enabled: !v.enabled } : v
    );
    const updatedSettings = { ...settings, videos: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (onRefreshData) onRefreshData(updatedSettings);
  };

  const handleToggleVideoFeatured = async (id: string) => {
    if (!settings) return;
    const target = (settings.videos || []).find(v => v.id === id);
    const nextFeatured = !target?.featured;
    const updated = (settings.videos || []).map(v => {
      if (v.id === id) return { ...v, featured: nextFeatured };
      if (nextFeatured) return { ...v, featured: false };
      return v;
    });
    const updatedSettings = { ...settings, videos: updated };
    setSettings(updatedSettings);
    await DataService.updateSettings(updatedSettings);
    if (onRefreshData) onRefreshData(updatedSettings);
  };

  // Outreach message presets
  const handleSetPresetMessage = (presetType: 'sample' | 'quote' | 'care' | 'standing') => {
    if (!selectedLead) return;
    if (presetType === 'sample') {
      setOutreachMessage(`Hello ${selectedLead.name}, this is Lomstel Agro regarding your interest in oyster mushrooms. We would love to prepare a fresh complimentary kitchen sample for you. Please let us know your preferred delivery window.`);
    } else if (presetType === 'quote') {
      setOutreachMessage(`Hello ${selectedLead.name}, thank you for inquiring about Lomstel Agro oyster mushrooms. Our wholesale pricing and minimum order quantities are attached. We deliver across Ogun State and Lagos with certified NAFDAC batch quality.`);
    } else if (presetType === 'care') {
      setOutreachMessage(`Hello ${selectedLead.name}, thank you for choosing Lomstel Oyster Mushrooms! For maximum tenderness, store unwashed in the refrigerator. Before cooking, gently wipe with a damp towel and sauté for 4-6 minutes. Enjoy your meal!`);
    } else if (presetType === 'standing') {
      setOutreachMessage(`Hello ${selectedLead.name}, Lomstel Agro is currently scheduling our weekly standing mushroom delivery routes. Would you like us to reserve a fixed weekly allocation for your establishment?`);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await testSupabaseConnection();
      setConnectionResult(res);
    } catch (e: any) {
      setConnectionResult({ success: false, message: e?.message || 'Connection test failed' });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-7xl w-full h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-[#EAF4EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#0B3D2E] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <LomstelLogo size="sm" variant="light" />
            <span className="hidden sm:inline-block w-px h-5 bg-white/20" />
            <span className="text-sm font-bold text-white tracking-wide font-display">
              MANAGEMENT CONTROL SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Admin Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Strict Password Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-[#F7F8F4]">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAF4EE] shadow-xl max-w-md w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B3D2E] mb-2 font-display">
                Authorized Personnel
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Enter your administrative key to manage the Lomstel Agro platform.
              </p>

              {loginError && (
                <div className="p-3 mb-4 bg-rose-50 text-rose-700 border border-rose-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                    autoFocus
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
                >
                  Verify & Enter
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F7F8F4]">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white border-r border-[#EAF4EE] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0 text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'orders' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Orders ({newOrdersCount} New)</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'analytics' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Visitor Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('outreach')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'outreach' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Outreach & Q&A</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'content' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Any Page / Text</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'products' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Manage Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'gallery' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Manage Gallery ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'videos' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videos & YouTube ({videosCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('scrolling')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'scrolling' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Scrolling Panel ({scrollingImagesCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'faqs' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Manage FAQs ({faqs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'testimonials' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Manage Testimonials</span>
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'branding' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Colors & Fonts</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'social' 
                    ? 'bg-[#146B4A] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-[#EAF4EE]'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Social Media Icons ({activeSocialLinksCount})</span>
              </button>

              <div className="md:mt-auto pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('supabase')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                    activeTab === 'supabase' 
                      ? 'bg-[#0B3D2E] text-white shadow-xs' 
                      : 'text-[#146B4A] bg-[#EAF4EE] hover:bg-[#d5e9dc]'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Connect Supabase & SQL</span>
                </button>
              </div>
            </div>

            {/* Main Workspace Body */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              
              {/* TAB 1: ORDER MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Total Orders</span>
                      <p className="text-2xl font-bold text-[#0B3D2E] font-mono tabular-nums">{totalOrdersCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <span className="text-[11px] font-bold text-blue-600 uppercase">New Orders</span>
                      <p className="text-2xl font-bold text-blue-700 font-mono tabular-nums">{newOrdersCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <span className="text-[11px] font-bold text-amber-600 uppercase">Processing</span>
                      <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums">{confirmedCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase">Delivered</span>
                      <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">{deliveredCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] shadow-2xs col-span-2 sm:col-span-1">
                      <span className="text-[11px] font-bold text-rose-600 uppercase">Cancelled</span>
                      <p className="text-2xl font-bold text-rose-700 font-mono tabular-nums">{cancelledCount}</p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-[#EAF4EE] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search customer, phone, ref..."
                        className="w-full pl-9 pr-3 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#146B4A]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={loadData}
                        className="p-2 rounded-xl bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d7ecd0] transition-colors"
                        title="Refresh Orders"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-2xl border border-[#EAF4EE] overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F7F8F4] border-b border-[#EAF4EE] text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                            <th className="p-4">Ref & Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Product & Quantity</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAF4EE]">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500">
                                No orders matching the criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => {
                              const customerMsg = `Hello ${order.customer_name}, this is Lomstel Agro regarding your oyster mushroom order #${order.id} for ${order.product} (${order.quantity}). We are preparing your order for prompt dispatch.`;
                              return (
                                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="p-4">
                                    <span className="font-mono font-bold text-[#0B3D2E] block">{order.id}</span>
                                    <span className="text-[11px] text-slate-400 tabular-nums">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                  </td>

                                  <td className="p-4">
                                    <span className="font-bold text-[#0B3D2E] block">{order.customer_name}</span>
                                    <span className="text-slate-500 font-mono text-[11px] block">{order.phone}</span>
                                    <span className="text-[10px] text-[#146B4A] font-semibold">{order.customer_type}</span>
                                  </td>

                                  <td className="p-4">
                                    <span className="font-medium text-[#0B3D2E] block">{order.product}</span>
                                    <span className="text-slate-600 text-[11px] font-semibold block">{order.quantity}</span>
                                    {order.message && (
                                      <span className="text-[11px] text-slate-400 italic block line-clamp-1 max-w-xs">
                                        "{order.message}"
                                      </span>
                                    )}
                                  </td>

                                  <td className="p-4 text-slate-700 max-w-xs">
                                    {order.delivery_location}
                                  </td>

                                  <td className="p-4">
                                    <select
                                      value={order.status}
                                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border focus:outline-none ${
                                        order.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        order.status === 'Contacted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        order.status === 'Confirmed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        order.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-rose-50 text-rose-700 border-rose-200'
                                      }`}
                                    >
                                      <option value="New">New</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </td>

                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <a
                                        href={getWhatsAppUrl(customerMsg, order.phone.replace(/[^0-9]/g, ''))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#146B4A] hover:bg-[#25D366]/20 transition-colors"
                                        title="Chat with Customer on WhatsApp"
                                      >
                                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                      </a>
                                      <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                        title="Delete Order"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISITOR ANALYTICS & CONVERSION TRACKER */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Traffic & Conversion Analytics</h3>
                    <p className="text-xs text-slate-500">Track unique visitors, page views, order conversion rates, and buyer sources.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                        <span>Total Pageviews</span>
                        <Eye className="w-4 h-4 text-[#146B4A]" />
                      </div>
                      <p className="text-3xl font-extrabold text-[#0B3D2E] font-mono tabular-nums">
                        {analytics.totalPageViews}
                      </p>
                      <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                        Live site sessions
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                        <span>Unique Visitors</span>
                        <Users className="w-4 h-4 text-[#146B4A]" />
                      </div>
                      <p className="text-3xl font-extrabold text-[#0B3D2E] font-mono tabular-nums">
                        {analytics.uniqueVisitors}
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Unique devices & browsers
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                        <span>Total Orders</span>
                        <ShoppingBag className="w-4 h-4 text-[#146B4A]" />
                      </div>
                      <p className="text-3xl font-extrabold text-[#0B3D2E] font-mono tabular-nums">
                        {totalOrdersCount}
                      </p>
                      <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                        {newOrdersCount} awaiting review
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                        <span>Order Conversion Rate</span>
                        <TrendingUp className="w-4 h-4 text-[#D4A72C]" />
                      </div>
                      <p className="text-3xl font-extrabold text-[#D4A72C] font-mono tabular-nums">
                        {conversionRate}%
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Orders per unique visitor
                      </span>
                    </div>
                  </div>

                  {/* Customer Segment Breakdown */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4">
                    <h4 className="font-bold text-sm text-[#0B3D2E]">Orders by Customer Segment</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      {['Home & Family', 'Restaurant', 'Hotel', 'Supermarket', 'Caterer'].map(cat => {
                        const count = orders.filter(o => o.customer_type === cat).length;
                        return (
                          <div key={cat} className="p-3 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE]">
                            <p className="text-slate-500 font-medium mb-1">{cat}</p>
                            <p className="text-xl font-bold text-[#0B3D2E] font-mono">{count} orders</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER OUTREACH & SMART WHATSAPP Q&A */}
              {activeTab === 'outreach' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Targeted Customer Outreach & Automated Q&A</h3>
                    <p className="text-xs text-slate-500">Reach the right buyers online (Restaurants, Hotels, Supermarkets, Caterers) with pre-formatted smart responses.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Customer Leads List */}
                    <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#EAF4EE] space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="text-xs font-bold text-[#0B3D2E]">Active Customer Inquiries</span>
                        <select
                          value={leadCategoryFilter}
                          onChange={(e) => setLeadCategoryFilter(e.target.value)}
                          className="px-2.5 py-1 bg-[#F7F8F4] border rounded-lg text-xs"
                        >
                          <option value="All">All Segments</option>
                          <option value="Restaurant">Restaurants</option>
                          <option value="Hotel">Hotels</option>
                          <option value="Supermarket">Supermarkets</option>
                          <option value="Home & Family">Home & Family</option>
                        </select>
                      </div>

                      <div className="space-y-2.5 max-h-[440px] overflow-y-auto">
                        {filteredLeads.map(lead => (
                          <div
                            key={lead.id}
                            onClick={() => {
                              setSelectedLead(lead);
                              setOutreachMessage(`Hello ${lead.name}, this is Lomstel Agro regarding your mushroom inquiry. How can we supply your kitchen this week?`);
                            }}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedLead?.id === lead.id
                                ? 'bg-[#EAF4EE] border-[#146B4A]'
                                : 'bg-[#F7F8F4] border-[#EAF4EE] hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#0B3D2E]">{lead.name}</span>
                              <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-[#146B4A]">
                                {lead.category}
                              </span>
                            </div>
                            <p className="text-slate-600 mb-1.5">{lead.interest}</p>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span>{lead.phone}</span>
                              <span className="text-amber-700 font-medium">{lead.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Smart Message Composer & Q&A Responder */}
                    <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#EAF4EE] space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b">
                        <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                        <h4 className="font-bold text-xs text-[#0B3D2E]">Automated WhatsApp Response Composer</h4>
                      </div>

                      {selectedLead ? (
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE]">
                            <p className="font-bold text-[#0B3D2E]">Replying to: {selectedLead.name}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{selectedLead.phone} · {selectedLead.category}</p>
                          </div>

                          <div>
                            <span className="font-bold block mb-1.5 text-slate-700">Quick Automated Templates:</span>
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                onClick={() => handleSetPresetMessage('sample')}
                                className="px-2.5 py-1 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d4eadc] rounded-lg font-medium"
                              >
                                Send Kitchen Sample Offer
                              </button>
                              <button
                                onClick={() => handleSetPresetMessage('quote')}
                                className="px-2.5 py-1 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d4eadc] rounded-lg font-medium"
                              >
                                Send Wholesale Quote
                              </button>
                              <button
                                onClick={() => handleSetPresetMessage('standing')}
                                className="px-2.5 py-1 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d4eadc] rounded-lg font-medium"
                              >
                                Reserve Weekly Route
                              </button>
                              <button
                                onClick={() => handleSetPresetMessage('care')}
                                className="px-2.5 py-1 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d4eadc] rounded-lg font-medium"
                              >
                                Mushroom Care Guide
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="font-bold block mb-1 text-slate-700">Personalized Message</label>
                            <textarea
                              rows={5}
                              value={outreachMessage}
                              onChange={(e) => setOutreachMessage(e.target.value)}
                              className="w-full px-3 py-2 bg-[#F7F8F4] border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#146B4A]"
                            />
                          </div>

                          <a
                            href={getWhatsAppUrl(outreachMessage, selectedLead.phone.replace(/[^0-9]/g, ''))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send Instant WhatsApp to {selectedLead.name}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="text-center py-16 text-slate-400 text-xs">
                          Select a customer from the left list to automatically draft and send tailored responses.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EDIT ANY PART OF WEBSITE (HOME, ABOUT, BENEFITS, FACILITY, CONTACT) */}
              {activeTab === 'content' && settings && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Edit Any Section of the Website</h3>
                      <p className="text-xs text-slate-500">Edit headlines, body stories, and upload images from anywhere.</p>
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#146B4A] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </button>
                  </div>

                  {saveStatus && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
                      {saveStatus}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* SECTION 1: HOME / HERO PAGE */}
                    <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B3D2E] pb-2 border-b">1. Hero Section (Home Page)</h4>
                      
                      <div>
                        <label className="font-bold block mb-1">Hero Display Headline</label>
                        <input
                          type="text"
                          value={settings.heroHeadline}
                          onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-display text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Hero Supporting Subtext</label>
                        <textarea
                          rows={2}
                          value={settings.heroSubheadline}
                          onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>

                      {/* Dual Hero Images: Fresh & Dried Oyster Mushrooms */}
                      <div className="pt-2 border-t space-y-4">
                        <div className="font-bold text-[#0B3D2E]">Home Page Hero Images (Fresh & Dried)</div>
                        
                        {/* 1. Fresh Oyster Mushroom Image */}
                        <div className="p-4 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE] space-y-2">
                          <label className="font-bold block text-slate-700">1. Fresh Oyster Mushroom Photo</label>
                          <div className="flex flex-wrap items-center gap-4">
                            {settings.heroImage && (
                              <img src={settings.heroImage} alt="Fresh hero preview" className="w-20 h-16 object-cover rounded-lg border shadow-xs" />
                            )}
                            <label className="flex items-center gap-2 px-3.5 py-2 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d5e9dc] rounded-xl cursor-pointer font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage ? 'Uploading...' : 'Upload Fresh Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'hero')}
                                className="hidden"
                              />
                            </label>
                            <div className="flex-1 min-w-[200px]">
                              <input
                                type="url"
                                value={settings.heroImage || ''}
                                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                                placeholder="Or paste Fresh Image Web URL..."
                                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Dried Oyster Mushroom Image */}
                        <div className="p-4 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE] space-y-2">
                          <label className="font-bold block text-slate-700">2. Dried Oyster Mushroom Photo</label>
                          <div className="flex flex-wrap items-center gap-4">
                            {settings.heroDriedImage && (
                              <img src={settings.heroDriedImage} alt="Dried hero preview" className="w-20 h-16 object-cover rounded-lg border shadow-xs" />
                            )}
                            <label className="flex items-center gap-2 px-3.5 py-2 bg-[#FAF2DC] text-[#9A6F12] hover:bg-[#f3e5bd] rounded-xl cursor-pointer font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingImage ? 'Uploading...' : 'Upload Dried Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'hero-dried')}
                                className="hidden"
                              />
                            </label>
                            <div className="flex-1 min-w-[200px]">
                              <input
                                type="url"
                                value={settings.heroDriedImage || ''}
                                onChange={(e) => setSettings({ ...settings, heroDriedImage: e.target.value })}
                                placeholder="Or paste Dried Image Web URL..."
                                className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: ABOUT US PAGE */}
                    <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B3D2E] pb-2 border-b">2. About Us Section</h4>
                      <div>
                        <label className="font-bold block mb-1">About Title</label>
                        <input
                          type="text"
                          value={settings.aboutTitle || 'FROM OUR FARM TO YOUR TABLE.'}
                          onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">About Narrative Story</label>
                        <textarea
                          rows={4}
                          value={settings.aboutText}
                          onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">About Facility Image (Upload from Device)</label>
                        <div className="flex items-center gap-4">
                          {settings.aboutImage && (
                            <img src={settings.aboutImage} alt="About preview" className="w-24 h-16 object-cover rounded-lg border" />
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d5e9dc] rounded-xl cursor-pointer font-bold">
                            <Upload className="w-4 h-4" />
                            <span>Choose About Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'about')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: BENEFITS / NUTRITION */}
                    <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B3D2E] pb-2 border-b">3. Benefits & Nutrition Section</h4>
                      <div>
                        <label className="font-bold block mb-1">Benefits Headline</label>
                        <input
                          type="text"
                          value={settings.benefitsHeadline || 'GOOD FOOD STARTS WITH GOOD CHOICES.'}
                          onChange={(e) => setSettings({ ...settings, benefitsHeadline: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Benefits Supporting Subtext</label>
                        <textarea
                          rows={2}
                          value={settings.benefitsSubtext || 'Oyster mushrooms are naturally low in calories and fat while providing a variety of nutrients that can complement a balanced diet.'}
                          onChange={(e) => setSettings({ ...settings, benefitsSubtext: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                    </div>

                    {/* SECTION 4: FACILITY TOUR */}
                    <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B3D2E] pb-2 border-b">4. Farm / Facility Section</h4>
                      <div>
                        <label className="font-bold block mb-1">Facility Headline</label>
                        <input
                          type="text"
                          value={settings.facilityHeadline || 'SEE WHERE YOUR MUSHROOMS COME FROM.'}
                          onChange={(e) => setSettings({ ...settings, facilityHeadline: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Facility Subtext</label>
                        <textarea
                          rows={2}
                          value={settings.facilitySubtext || 'Take a closer look at the environment where Lomstel Oyster Mushrooms are cultivated, harvested and prepared.'}
                          onChange={(e) => setSettings({ ...settings, facilitySubtext: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Facility Photo (Upload from Device)</label>
                        <div className="flex items-center gap-4">
                          {settings.facilityImage && (
                            <img src={settings.facilityImage} alt="Facility preview" className="w-24 h-16 object-cover rounded-lg border" />
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d5e9dc] rounded-xl cursor-pointer font-bold">
                            <Upload className="w-4 h-4" />
                            <span>Choose Facility Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'facility')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: CONTACT US */}
                    <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B3D2E] pb-2 border-b">5. Contact Us Section</h4>
                      <div>
                        <label className="font-bold block mb-1">Contact Headline</label>
                        <input
                          type="text"
                          value={settings.contactHeadline || 'GET IN TOUCH WITH LOMSTEL AGRO'}
                          onChange={(e) => setSettings({ ...settings, contactHeadline: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Farm & Office Physical Address</label>
                        <input
                          type="text"
                          value={settings.locationAddress}
                          onChange={(e) => setSettings({ ...settings, locationAddress: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold block mb-1">Primary WhatsApp (numbers only)</label>
                          <input
                            type="text"
                            value={settings.whatsappNumber}
                            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Secondary Phone</label>
                          <input
                            type="text"
                            value={settings.secondaryPhone}
                            onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4] font-mono"
                          />
                        </div>
                      </div>

                      {/* Social Media Links shortcut */}
                      <div className="pt-3 border-t flex items-center justify-between bg-[#EAF4EE] p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-[#146B4A]" />
                          <span className="font-bold text-[#0B3D2E]">Social Media Icons ({activeSocialLinksCount} Active)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('social')}
                          className="px-3 py-1.5 bg-[#146B4A] hover:bg-[#0B3D2E] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Manage Social Icons &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PRODUCTS CRUD WITH DEVICE UPLOAD */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Manage Mushroom Catalog</h3>
                      <p className="text-xs text-slate-500">Edit titles, packaging, descriptions, and upload photos from anywhere.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: `prod-${Date.now()}`,
                          name: 'New Oyster Product',
                          category: 'fresh',
                          tagline: 'Fresh Harvest',
                          description: 'Description here...',
                          unit: 'Standard Pack (1kg)',
                          priceEstimate: 'On request',
                          image: gallery[0]?.imageUrl || '',
                          features: ['100% Organically cultivated', 'Harvested fresh'],
                          useCases: ['Soups', 'Rice dishes'],
                          inStock: true,
                          whatsappMessage: 'Hello Lomstel Agro, I would like to order...'
                        });
                        setIsAddingProduct(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#146B4A] text-white text-xs font-bold rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {(editingProduct || isAddingProduct) && editingProduct && (
                    <div className="bg-white p-6 rounded-2xl border border-[#146B4A]/30 shadow-md space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-bold text-sm text-[#0B3D2E]">
                          {isAddingProduct ? 'Add New Product' : `Editing: ${editingProduct.name}`}
                        </h4>
                        <button 
                          onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold block mb-1">Product Name</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Category</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          >
                            <option value="fresh">Fresh Mushrooms</option>
                            <option value="dried">Dried Mushrooms</option>
                            <option value="wholesale">Wholesale / Bulk</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Tagline</label>
                          <input
                            type="text"
                            value={editingProduct.tagline}
                            onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Packaging / Unit Info</label>
                          <input
                            type="text"
                            value={editingProduct.unit}
                            onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>

                        {/* Product Image Uploader from device */}
                        <div className="sm:col-span-2">
                          <label className="font-bold block mb-1">Product Photo (Upload from Device or URL)</label>
                          <div className="flex items-center gap-4">
                            {editingProduct.image && (
                              <img src={editingProduct.image} alt="Product preview" className="w-20 h-16 object-cover rounded-lg border" />
                            )}
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d5e9dc] rounded-xl cursor-pointer font-bold">
                              <Upload className="w-4 h-4" />
                              <span>Upload Photo from Computer</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'product')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold block mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold block mb-1">Pre-filled WhatsApp Message</label>
                          <input
                            type="text"
                            value={editingProduct.whatsappMessage}
                            onChange={(e) => setEditingProduct({ ...editingProduct, whatsappMessage: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="stock_check"
                            checked={editingProduct.inStock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          />
                          <label htmlFor="stock_check" className="font-bold">Currently in stock</label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                          className="px-4 py-2 border rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveProduct(editingProduct)}
                          className="px-5 py-2 bg-[#146B4A] text-white rounded-lg text-xs font-bold"
                        >
                          Save Product
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl border border-[#EAF4EE] overflow-hidden p-5 flex flex-col justify-between shadow-2xs">
                        <div>
                          <div className="h-40 rounded-xl overflow-hidden mb-4 bg-slate-100">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] uppercase font-bold text-[#146B4A] bg-[#EAF4EE] px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h4 className="text-base font-bold text-[#0B3D2E] mt-1.5 mb-1">{p.name}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{p.description}</p>
                          <p className="text-xs text-slate-500 font-semibold">{p.unit}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#EAF4EE]">
                          <span className={`text-xs font-bold ${p.inStock ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {p.inStock ? '• In Stock' : '• Out of Stock'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingProduct(p); setIsAddingProduct(false); }}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GALLERY CRUD WITH DEVICE UPLOAD & FULL EDITING */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Top Bar Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Manage Gallery Photography</h3>
                      <p className="text-xs text-slate-500">
                        Upload photos from your phone, laptop, or camera anywhere, paste image web links, edit pictures and text, or delete items.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAddingGallery(!isAddingGallery);
                          setEditingGalleryItem(null);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Category Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-[#EAF4EE]">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search gallery by title or caption..."
                        value={gallerySearchQuery}
                        onChange={(e) => setGallerySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                      {['All', 'Our Farm', 'Fresh Mushrooms', 'Packaging', 'Food & Recipes', 'Our Facility'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setGalleryFilterCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            galleryFilterCategory === cat
                              ? 'bg-[#146B4A] text-white'
                              : 'bg-[#F7F8F4] text-slate-600 hover:text-[#0B3D2E]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* EDIT GALLERY ITEM PANEL */}
                  {editingGalleryItem && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#146B4A] shadow-md space-y-4 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#EAF4EE] text-[#146B4A]">
                            <Edit3 className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-[#0B3D2E]">Edit Gallery Picture & Details</h4>
                            <p className="text-[11px] text-slate-500">Modify the photo, change text, or update the category.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingGalleryItem(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Image preview & image changing controls */}
                        <div className="space-y-3">
                          <label className="font-bold block text-slate-700">Photo Preview</label>
                          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-[#EAF4EE] flex items-center justify-center">
                            {editingGalleryItem.imageUrl ? (
                              <img
                                src={editingGalleryItem.imageUrl}
                                alt={editingGalleryItem.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-slate-400 text-xs">No image provided</span>
                            )}
                          </div>

                          {/* Image source: Upload from device */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Upload New Photo from Device:
                            </label>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#EAF4EE] hover:bg-[#d5e9dc] text-[#146B4A] font-bold rounded-xl cursor-pointer transition-colors">
                              <Upload className="w-4 h-4" />
                              <span>{uploadingImage ? 'Uploading...' : 'Choose File from Device'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'gallery-edit')}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Image source: Or paste web URL */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Or Paste Image URL from anywhere:
                            </label>
                            <input
                              type="url"
                              value={editingGalleryItem.imageUrl}
                              onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full px-3 py-2 border rounded-xl bg-[#F7F8F4] font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Right: Text fields (Title, Category, Caption) */}
                        <div className="lg:col-span-2 space-y-3">
                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Image Title</label>
                            <input
                              type="text"
                              value={editingGalleryItem.title}
                              onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                              placeholder="e.g. Fresh Oyster Harvest in Ogun State"
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Category</label>
                            <select
                              value={editingGalleryItem.category}
                              onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-medium"
                            >
                              <option value="Our Farm">Our Farm</option>
                              <option value="Fresh Mushrooms">Fresh Mushrooms</option>
                              <option value="Packaging">Packaging</option>
                              <option value="Food & Recipes">Food & Recipes</option>
                              <option value="Our Facility">Our Facility</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Caption / Description</label>
                            <textarea
                              rows={3}
                              value={editingGalleryItem.caption || ''}
                              onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                              placeholder="Describe this photo for visitors..."
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(editingGalleryItem.id)}
                              className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Photo</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingGalleryItem(null)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEditedGalleryItem}
                                className="flex items-center gap-1.5 px-5 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADD NEW GALLERY ITEM FORM */}
                  {isAddingGallery && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#146B4A]/40 shadow-sm space-y-4 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#EAF4EE] text-[#146B4A]">
                            <Plus className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-[#0B3D2E]">Add New Gallery Image</h4>
                            <p className="text-[11px] text-slate-500">Upload a picture from your device or paste a web URL.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsAddingGallery(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Preview & Upload Controls */}
                        <div className="space-y-3">
                          <label className="font-bold block text-slate-700">Image Source</label>
                          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-[#EAF4EE] flex items-center justify-center">
                            {newGalleryItem.imageUrl ? (
                              <img
                                src={newGalleryItem.imageUrl}
                                alt="Upload preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4 text-slate-400">
                                <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                <span className="text-[11px]">Upload or paste a link to preview</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Upload from Device (phone/laptop):
                            </label>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#EAF4EE] hover:bg-[#d5e9dc] text-[#146B4A] font-bold rounded-xl cursor-pointer transition-colors">
                              <Upload className="w-4 h-4" />
                              <span>{uploadingImage ? 'Uploading...' : 'Choose File from Device'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'gallery')}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Or Paste Image URL from anywhere:
                            </label>
                            <input
                              type="url"
                              value={newGalleryItem.imageUrl}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full px-3 py-2 border rounded-xl bg-[#F7F8F4] font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Title, Category & Caption */}
                        <div className="lg:col-span-2 space-y-3">
                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Image Title *</label>
                            <input
                              type="text"
                              value={newGalleryItem.title}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                              placeholder="e.g. Crisp Harvest Basket"
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Category</label>
                            <select
                              value={newGalleryItem.category}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-medium"
                            >
                              <option value="Our Farm">Our Farm</option>
                              <option value="Fresh Mushrooms">Fresh Mushrooms</option>
                              <option value="Packaging">Packaging</option>
                              <option value="Food & Recipes">Food & Recipes</option>
                              <option value="Our Facility">Our Facility</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Caption / Description</label>
                            <textarea
                              rows={3}
                              value={newGalleryItem.caption}
                              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption: e.target.value })}
                              placeholder="Optional descriptive caption for the image lightbox..."
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => setIsAddingGallery(false)}
                              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddGalleryItem}
                              className="flex items-center gap-1.5 px-5 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add to Gallery</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GALLERY ITEMS GRID */}
                  {(() => {
                    const filteredGallery = gallery.filter((g) => {
                      const matchesCategory =
                        galleryFilterCategory === 'All' || g.category === galleryFilterCategory;
                      const matchesSearch =
                        !gallerySearchQuery ||
                        g.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
                        (g.caption && g.caption.toLowerCase().includes(gallerySearchQuery.toLowerCase()));
                      return matchesCategory && matchesSearch;
                    });

                    if (filteredGallery.length === 0) {
                      return (
                        <div className="bg-white p-12 rounded-2xl border border-[#EAF4EE] text-center space-y-3">
                          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                          <h4 className="font-bold text-sm text-[#0B3D2E]">No photos found</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {gallerySearchQuery || galleryFilterCategory !== 'All'
                              ? 'Try adjusting your search query or category filter.'
                              : 'Get started by adding your first harvest photo or facility picture.'}
                          </p>
                          <button
                            onClick={() => {
                              setIsAddingGallery(true);
                              setEditingGalleryItem(null);
                            }}
                            className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-xl text-xs"
                          >
                            Add New Photo
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredGallery.map((g) => {
                          const isBeingEdited = editingGalleryItem?.id === g.id;
                          return (
                            <div
                              key={g.id}
                              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col group ${
                                isBeingEdited
                                  ? 'border-[#146B4A] ring-2 ring-[#146B4A]/20 shadow-md'
                                  : 'border-[#EAF4EE] hover:shadow-md'
                              }`}
                            >
                              {/* Photo Header */}
                              <div className="h-44 relative bg-slate-900 overflow-hidden">
                                <img
                                  src={g.imageUrl}
                                  alt={g.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Category Tag */}
                                <div className="absolute top-2.5 left-2.5">
                                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-md">
                                    {g.category}
                                  </span>
                                </div>

                                {/* Floating Action Buttons */}
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditGallery(g)}
                                    className="p-1.5 rounded-lg bg-white/95 hover:bg-[#146B4A] text-[#146B4A] hover:text-white shadow-xs transition-colors cursor-pointer"
                                    title="Edit Photo and Text"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGallery(g.id)}
                                    className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white shadow-xs transition-colors cursor-pointer"
                                    title="Delete Photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Card Content & Action Bar */}
                              <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                                <div>
                                  <h4 className="font-bold text-[#0B3D2E] text-sm line-clamp-1" title={g.title}>
                                    {g.title}
                                  </h4>
                                  {g.caption && (
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                      {g.caption}
                                    </p>
                                  )}
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => handleEditGallery(g)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit Picture & Text</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGallery(g.id)}
                                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB: VIDEO SHOWCASE & YOUTUBE LINKS */}
              {activeTab === 'videos' && settings && (
                <div className="space-y-6">
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Video Showcase & YouTube Links</h3>
                        <span className="text-xs font-bold text-[#146B4A] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full">
                          {activeVideosCount} Active / {videosCount} Total
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add and manage YouTube videos displayed in the &quot;Watch Our Farm in Action&quot; section on the home page.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingVideo(true);
                          setEditingVideo(null);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add YouTube Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Title Customization Card */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#146B4A]" />
                        <span>Home Page Video Section Headlines</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Headlines</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Section Headline
                        </label>
                        <input
                          type="text"
                          value={settings.videoSectionHeadline || ''}
                          onChange={(e) => setSettings({ ...settings, videoSectionHeadline: e.target.value })}
                          placeholder="e.g. WATCH OUR FARM IN ACTION"
                          className="w-full px-3 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Section Subheadline / Tagline
                        </label>
                        <input
                          type="text"
                          value={settings.videoSectionSubheadline || ''}
                          onChange={(e) => setSettings({ ...settings, videoSectionSubheadline: e.target.value })}
                          placeholder="e.g. Experience how Lomstel Agro cultivates, harvests, and prepares premium oyster mushrooms..."
                          className="w-full px-3 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ADD VIDEO FORM */}
                  {isAddingVideo && (
                    <div className="bg-[#F7F8F4] p-5 sm:p-6 rounded-2xl border-2 border-[#146B4A] space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-[#EAF4EE]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                            <Youtube className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0B3D2E]">Add New YouTube Video</h4>
                            <p className="text-[11px] text-slate-500">Paste any standard YouTube link, shortened link, or video ID.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingVideo(false)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* YouTube URL input with live detection */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="block font-bold text-slate-700">
                            YouTube Video URL or Video ID <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newVideo.youtubeUrl}
                              onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                              placeholder="e.g. https://www.youtube.com/watch?v=F_fK8d6c7uE or https://youtu.be/..."
                              className="w-full pl-3 pr-24 py-2.5 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                              autoFocus
                            />
                            {isValidYouTubeUrl(newVideo.youtubeUrl) && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <Check className="w-3 h-3" />
                                <span>Valid Link</span>
                              </span>
                            )}
                          </div>

                          {/* Live Video Detection & Thumbnail Preview Card */}
                          {(() => {
                            const detectedId = extractYouTubeId(newVideo.youtubeUrl);
                            if (detectedId) {
                              return (
                                <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-3">
                                  <div className="relative w-36 aspect-video shrink-0 rounded-lg overflow-hidden bg-black shadow-xs">
                                    <img
                                      src={getYouTubeThumbnailUrl(detectedId, 'hq')}
                                      alt="YouTube Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play className="w-6 h-6 fill-white text-white opacity-85" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0 text-[11px] space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-emerald-700">YouTube Video Detected</span>
                                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        ID: {detectedId}
                                      </span>
                                    </div>
                                    <p className="text-slate-600">
                                      This video will embed smoothly on the home page and provide high-resolution thumbnail previews.
                                    </p>
                                    <a
                                      href={getYouTubeWatchUrl(detectedId)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[#146B4A] hover:underline font-semibold"
                                    >
                                      <span>Test link on YouTube</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                            if (newVideo.youtubeUrl.trim() && !detectedId) {
                              return (
                                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)</span>
                                </p>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Video Title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            placeholder="e.g. Morning Hand-Harvesting in Growing Room 2"
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Category / Tag
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={newVideo.category}
                              onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                            >
                              <option value="Farm Tour & Harvest">Farm Tour & Harvest</option>
                              <option value="Mushroom Cultivation">Mushroom Cultivation</option>
                              <option value="Recipes & Culinary">Recipes & Culinary</option>
                              <option value="Packaging & Quality">Packaging & Quality</option>
                              <option value="Health & Nutrition">Health & Nutrition</option>
                              <option value="Customer Story">Customer Story</option>
                            </select>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Estimated Duration
                          </label>
                          <input
                            type="text"
                            value={newVideo.duration}
                            onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                            placeholder="e.g. 4:15"
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>

                        {/* Options checkboxes */}
                        <div className="flex items-center gap-6 pt-5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={newVideo.featured}
                              onChange={(e) => setNewVideo({ ...newVideo, featured: e.target.checked })}
                              className="rounded text-[#146B4A] focus:ring-[#146B4A] w-4 h-4"
                            />
                            <span className="font-bold text-slate-700">Pin as Primary Video</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={newVideo.enabled}
                              onChange={(e) => setNewVideo({ ...newVideo, enabled: e.target.checked })}
                              className="rounded text-[#146B4A] focus:ring-[#146B4A] w-4 h-4"
                            />
                            <span className="font-bold text-slate-700">Enabled on Home Page</span>
                          </label>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            Video Description (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={newVideo.description}
                            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                            placeholder="Briefly describe what visitors will learn or watch in this video..."
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsAddingVideo(false)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddVideo}
                          disabled={!isValidYouTubeUrl(newVideo.youtubeUrl)}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Publish Video to Home Page</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* EDIT VIDEO MODAL / FORM */}
                  {editingVideo && (
                    <div className="bg-[#F7F8F4] p-5 sm:p-6 rounded-2xl border-2 border-[#146B4A] space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-[#EAF4EE]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Edit3 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0B3D2E]">Edit YouTube Video</h4>
                            <p className="text-[11px] text-slate-500">Update video link, title, category, or duration.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingVideo(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* YouTube URL input with live detection */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="block font-bold text-slate-700">
                            YouTube Video URL or Video ID <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={editingVideo.youtubeUrl}
                              onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
                              placeholder="e.g. https://www.youtube.com/watch?v=..."
                              className="w-full pl-3 pr-24 py-2.5 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                            />
                            {isValidYouTubeUrl(editingVideo.youtubeUrl) && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <Check className="w-3 h-3" />
                                <span>Valid Link</span>
                              </span>
                            )}
                          </div>

                          {/* Live preview */}
                          {(() => {
                            const detectedId = extractYouTubeId(editingVideo.youtubeUrl);
                            if (detectedId) {
                              return (
                                <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-3">
                                  <div className="relative w-36 aspect-video shrink-0 rounded-lg overflow-hidden bg-black shadow-xs">
                                    <img
                                      src={getYouTubeThumbnailUrl(detectedId, 'hq')}
                                      alt="YouTube Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play className="w-6 h-6 fill-white text-white opacity-85" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0 text-[11px] space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-emerald-700">Valid YouTube ID:</span>
                                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        {detectedId}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setAdminPreviewVideo(editingVideo)}
                                      className="inline-flex items-center gap-1 text-[#146B4A] hover:underline font-semibold cursor-pointer"
                                    >
                                      <Play className="w-3 h-3" />
                                      <span>Test preview player in popup</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Video Title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editingVideo.title}
                            onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Category / Tag
                          </label>
                          <select
                            value={editingVideo.category || 'Farm Tour & Harvest'}
                            onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          >
                            <option value="Farm Tour & Harvest">Farm Tour & Harvest</option>
                            <option value="Mushroom Cultivation">Mushroom Cultivation</option>
                            <option value="Recipes & Culinary">Recipes & Culinary</option>
                            <option value="Packaging & Quality">Packaging & Quality</option>
                            <option value="Health & Nutrition">Health & Nutrition</option>
                            <option value="Customer Story">Customer Story</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Estimated Duration
                          </label>
                          <input
                            type="text"
                            value={editingVideo.duration || ''}
                            onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                            placeholder="e.g. 4:15"
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>

                        <div className="flex items-center gap-6 pt-5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(editingVideo.featured)}
                              onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                              className="rounded text-[#146B4A] focus:ring-[#146B4A] w-4 h-4"
                            />
                            <span className="font-bold text-slate-700">Pin as Primary Video</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={editingVideo.enabled}
                              onChange={(e) => setEditingVideo({ ...editingVideo, enabled: e.target.checked })}
                              className="rounded text-[#146B4A] focus:ring-[#146B4A] w-4 h-4"
                            />
                            <span className="font-bold text-slate-700">Enabled on Website</span>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            Video Description
                          </label>
                          <textarea
                            rows={2}
                            value={editingVideo.description || ''}
                            onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#EAF4EE] rounded-xl text-xs focus:ring-1 focus:ring-[#146B4A]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setEditingVideo(null)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEditedVideo}
                          disabled={!isValidYouTubeUrl(editingVideo.youtubeUrl)}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LIST OF VIDEOS */}
                  {(!settings.videos || settings.videos.length === 0) ? (
                    <div className="bg-white p-12 rounded-2xl border border-[#EAF4EE] text-center space-y-3">
                      <Film className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-sm text-[#0B3D2E]">No YouTube videos added yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Paste your farm video links or harvest tutorials from YouTube to showcase them on the website.
                      </p>
                      <button
                        onClick={() => setIsAddingVideo(true)}
                        className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Add First Video
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {settings.videos.map((video) => {
                        const ytId = extractYouTubeId(video.youtubeUrl);
                        return (
                          <div
                            key={video.id}
                            className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                              video.enabled ? 'border-[#EAF4EE]' : 'border-slate-200 opacity-60'
                            }`}
                          >
                            {/* Video Thumbnail Viewport */}
                            <div className="relative aspect-video bg-black overflow-hidden group">
                              {ytId ? (
                                <img
                                  src={getYouTubeThumbnailUrl(ytId, 'hq')}
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  <Film className="w-8 h-8" />
                                </div>
                              )}

                              {/* Play Button Overlay */}
                              <button
                                type="button"
                                onClick={() => setAdminPreviewVideo(video)}
                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-[#146B4A] text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg"
                                title="Play preview"
                              >
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </button>

                              {/* Top Badges */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                                {video.featured && (
                                  <span className="px-2 py-0.5 bg-[#D4A72C] text-[#08281E] text-[10px] font-bold rounded-md shadow-xs flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Primary Featured</span>
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs ${
                                  video.enabled ? 'bg-[#146B4A]' : 'bg-slate-600'
                                }`}>
                                  {video.enabled ? 'Active on Home' : 'Disabled'}
                                </span>
                              </div>

                              {/* Top Right Actions */}
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                                <a
                                  href={getYouTubeWatchUrl(video.youtubeUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white transition-colors"
                                  title="Open in YouTube"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                  title="Delete video"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Duration Bottom Tag */}
                              {video.duration && (
                                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                                  {video.duration}
                                </span>
                              )}
                            </div>

                            {/* Details & Actions */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                {video.category && (
                                  <span className="text-[10px] font-bold text-[#146B4A] uppercase tracking-wider block mb-1">
                                    {video.category}
                                  </span>
                                )}
                                <h4 className="font-bold text-xs text-[#0B3D2E] line-clamp-2">{video.title}</h4>
                                {video.description && (
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{video.description}</p>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVideoEnabled(video.id)}
                                    className={`font-semibold cursor-pointer ${
                                      video.enabled ? 'text-amber-600 hover:text-amber-800' : 'text-[#146B4A] hover:text-[#0B3D2E]'
                                    }`}
                                  >
                                    {video.enabled ? 'Disable' : 'Enable'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleVideoFeatured(video.id)}
                                    className={`font-semibold cursor-pointer ${
                                      video.featured ? 'text-slate-500 hover:text-slate-700' : 'text-[#D4A72C] hover:text-[#b88e1e]'
                                    }`}
                                  >
                                    {video.featured ? 'Unpin' : 'Pin Primary'}
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVideo(video);
                                    setIsAddingVideo(false);
                                  }}
                                  className="flex items-center gap-1 font-bold text-[#146B4A] hover:text-[#0B3D2E] cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* IN-ADMIN VIDEO PREVIEW MODAL */}
                  {adminPreviewVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in">
                      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#0B3D2E] text-white">
                          <div className="flex items-center gap-2 truncate mr-4">
                            <Youtube className="w-4 h-4 text-rose-500" />
                            <h4 className="text-sm font-bold truncate">{adminPreviewVideo.title}</h4>
                          </div>
                          <button
                            onClick={() => setAdminPreviewVideo(null)}
                            className="p-1 rounded-lg text-white hover:bg-white/10 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="aspect-video w-full bg-black">
                          {extractYouTubeId(adminPreviewVideo.youtubeUrl) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(adminPreviewVideo.youtubeUrl, { autoplay: true, rel: false })}
                              title={adminPreviewVideo.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                              Invalid YouTube Link
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono">
                            {adminPreviewVideo.youtubeUrl}
                          </span>
                          <button
                            onClick={() => setAdminPreviewVideo(null)}
                            className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-xl text-xs hover:bg-[#0B3D2E] cursor-pointer"
                          >
                            Close Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: AUTO-SCROLLING PANEL CRUD */}
              {activeTab === 'scrolling' && settings && (
                <div className="space-y-6">
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Auto-Scrolling Images Panel</h3>
                        <span className="text-xs font-bold text-[#146B4A] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full">
                          {activeScrollingImagesCount} Active / {scrollingImagesCount} Total
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        These photos scroll continuously across the home page ribbon. Add, edit, or remove photos anytime.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingScrolling(!isAddingScrolling);
                          setEditingScrollingItem(null);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAddingScrolling ? 'Close Form' : 'Add Photo to Panel'}</span>
                      </button>
                    </div>
                  </div>

                  {saveStatus && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveStatus}</span>
                    </div>
                  )}

                  {/* ADD NEW PHOTO PANEL */}
                  {isAddingScrolling && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#146B4A]/30 shadow-md space-y-4 animate-in fade-in text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-[#146B4A]" />
                          <h4 className="font-bold text-sm text-[#0B3D2E]">Add Photo to Auto-Scrolling Ribbon</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingScrolling(false)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Preview & Upload */}
                        <div className="space-y-3">
                          <label className="font-bold block text-slate-700">Image Source (Upload or URL) *</label>
                          <div className="w-full h-40 bg-[#F7F8F4] rounded-xl border border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center p-3 relative group">
                            {newScrollingItem.imageUrl ? (
                              <>
                                <img
                                  src={newScrollingItem.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[11px] text-white font-semibold">Image Ready</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-1 text-slate-400">
                                <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                                <p className="text-[11px]">Upload photo or paste URL</p>
                              </div>
                            )}
                          </div>

                          <label className="flex items-center justify-center gap-2 w-full py-2 bg-[#EAF4EE] hover:bg-[#d5e9dc] text-[#146B4A] font-bold rounded-xl cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Uploading...' : 'Choose from Device'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'scrolling-add')}
                              className="hidden"
                            />
                          </label>

                          <div>
                            <input
                              type="url"
                              value={newScrollingItem.imageUrl}
                              onChange={(e) => setNewScrollingItem({ ...newScrollingItem, imageUrl: e.target.value })}
                              placeholder="Or paste image web link (https://...)"
                              className="w-full px-3 py-2 border rounded-xl bg-[#F7F8F4] font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Title & Caption */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Image Title / Headline *</label>
                            <input
                              type="text"
                              value={newScrollingItem.title}
                              onChange={(e) => setNewScrollingItem({ ...newScrollingItem, title: e.target.value })}
                              placeholder="e.g. Fresh Oyster Flush on Substrate"
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Short Caption</label>
                            <textarea
                              rows={3}
                              value={newScrollingItem.caption}
                              onChange={(e) => setNewScrollingItem({ ...newScrollingItem, caption: e.target.value })}
                              placeholder="e.g. Harvested cluster by cluster at prime tender maturity"
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs"
                            />
                          </div>

                          <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={newScrollingItem.enabled}
                                onChange={(e) => setNewScrollingItem({ ...newScrollingItem, enabled: e.target.checked })}
                                className="w-4 h-4 text-[#146B4A] rounded border-slate-300 focus:ring-[#146B4A]"
                              />
                              <span className="font-semibold text-slate-700">Display actively in the scrolling ribbon</span>
                            </label>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => setIsAddingScrolling(false)}
                              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddScrollingItem}
                              className="flex items-center gap-1.5 px-5 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add to Scrolling Panel</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EDIT EXISTING PHOTO PANEL */}
                  {editingScrollingItem && (
                    <div className="bg-[#FAF8F2] p-6 rounded-2xl border-2 border-[#D4A72C] shadow-md space-y-4 animate-in fade-in text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-[#D4A72C]/30">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[#9A6F12]" />
                          <h4 className="font-bold text-sm text-[#0B3D2E]">Edit Scrolling Image: {editingScrollingItem.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingScrollingItem(null)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Preview & Upload */}
                        <div className="space-y-3">
                          <label className="font-bold block text-slate-700">Update Photo</label>
                          <div className="w-full h-40 bg-white rounded-xl border border-slate-200 overflow-hidden relative">
                            <img
                              src={editingScrollingItem.imageUrl}
                              alt={editingScrollingItem.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <label className="flex items-center justify-center gap-2 w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border font-bold rounded-xl cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Uploading...' : 'Replace File from Device'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'scrolling-edit')}
                              className="hidden"
                            />
                          </label>

                          <div>
                            <input
                              type="url"
                              value={editingScrollingItem.imageUrl}
                              onChange={(e) => setEditingScrollingItem({ ...editingScrollingItem, imageUrl: e.target.value })}
                              placeholder="Or paste updated Image URL..."
                              className="w-full px-3 py-2 border rounded-xl bg-white font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Title & Caption */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Image Title</label>
                            <input
                              type="text"
                              value={editingScrollingItem.title}
                              onChange={(e) => setEditingScrollingItem({ ...editingScrollingItem, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-white text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="font-bold block text-slate-700 mb-1">Caption</label>
                            <textarea
                              rows={3}
                              value={editingScrollingItem.caption || ''}
                              onChange={(e) => setEditingScrollingItem({ ...editingScrollingItem, caption: e.target.value })}
                              className="w-full px-3.5 py-2.5 border rounded-xl bg-white text-xs"
                            />
                          </div>

                          <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editingScrollingItem.enabled}
                                onChange={(e) => setEditingScrollingItem({ ...editingScrollingItem, enabled: e.target.checked })}
                                className="w-4 h-4 text-[#146B4A] rounded border-slate-300 focus:ring-[#146B4A]"
                              />
                              <span className="font-semibold text-slate-700">Display actively in the scrolling ribbon</span>
                            </label>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => setEditingScrollingItem(null)}
                              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEditedScrollingItem}
                              className="flex items-center gap-1.5 px-5 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LIST OF SCROLLING IMAGES */}
                  {(!settings.scrollingImages || settings.scrollingImages.length === 0) ? (
                    <div className="bg-white p-12 rounded-2xl border border-[#EAF4EE] text-center space-y-3">
                      <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-sm text-[#0B3D2E]">No photos in the scrolling ribbon</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click the button below to add your first photo to the home page auto-scrolling ribbon.
                      </p>
                      <button
                        onClick={() => setIsAddingScrolling(true)}
                        className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Add Photo
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {settings.scrollingImages.map((item) => (
                        <div
                          key={item.id}
                          className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                            item.enabled ? 'border-[#EAF4EE]' : 'border-slate-200 opacity-60'
                          }`}
                        >
                          {/* Image preview */}
                          <div className="relative h-44 bg-slate-900 overflow-hidden group">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs ${
                                item.enabled ? 'bg-[#146B4A]' : 'bg-slate-500'
                              }`}>
                                {item.enabled ? 'Active on Ribbon' : 'Disabled'}
                              </span>
                            </div>
                            <div className="absolute top-2.5 right-2.5">
                              <button
                                type="button"
                                onClick={() => handleDeleteScrollingItem(item.id)}
                                className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Details & Actions */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <h4 className="font-bold text-xs text-[#0B3D2E] line-clamp-1">{item.title}</h4>
                              {item.caption && (
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.caption}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                              <button
                                type="button"
                                onClick={() => handleToggleScrollingItem(item.id)}
                                className={`font-semibold cursor-pointer ${
                                  item.enabled ? 'text-amber-600 hover:text-amber-800' : 'text-[#146B4A] hover:text-[#0B3D2E]'
                                }`}
                              >
                                {item.enabled ? 'Disable' : 'Enable'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingScrollingItem(item);
                                  setIsAddingScrolling(false);
                                }}
                                className="flex items-center gap-1 font-bold text-[#146B4A] hover:text-[#0B3D2E] cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Manage FAQs</h3>
                      <p className="text-xs text-slate-500">Add, edit, or reorder client questions.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFaq({
                          id: `faq-${Date.now()}`,
                          order: faqs.length + 1,
                          question: '',
                          answer: ''
                        });
                        setIsAddingFaq(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#146B4A] text-white text-xs font-bold rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  {(editingFaq || isAddingFaq) && editingFaq && (
                    <div className="bg-white p-5 rounded-2xl border border-[#146B4A]/30 space-y-3 text-xs">
                      <div>
                        <label className="font-bold block mb-1">Question</label>
                        <input
                          type="text"
                          value={editingFaq.question}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Answer</label>
                        <textarea
                          rows={3}
                          value={editingFaq.answer}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => { setEditingFaq(null); setIsAddingFaq(false); }} className="px-4 py-2 border rounded-lg">
                          Cancel
                        </button>
                        <button onClick={() => handleSaveFaq(editingFaq)} className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-lg">
                          Save FAQ
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {faqs.map((f, i) => (
                      <div key={f.id} className="bg-white p-4 rounded-xl border border-[#EAF4EE] flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#D4A72C] uppercase block mb-1">Question {i + 1}</span>
                          <h4 className="text-sm font-bold text-[#0B3D2E] mb-1">{f.question}</h4>
                          <p className="text-xs text-slate-600">{f.answer}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => { setEditingFaq(f); setIsAddingFaq(false); }}
                            className="p-1.5 bg-slate-100 rounded-lg text-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(f.id)}
                            className="p-1.5 bg-rose-50 rounded-lg text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Manage Testimonials</h3>
                      <p className="text-xs text-slate-500">Edit feedback and toggle publishing on the website.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTestimonial({
                          id: `test-${Date.now()}`,
                          quote: '',
                          clientType: 'Customer',
                          location: 'Nigeria',
                          isPublished: true,
                          note: 'Editable review'
                        });
                        setIsAddingTestimonial(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#146B4A] text-white text-xs font-bold rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  {(editingTestimonial || isAddingTestimonial) && editingTestimonial && (
                    <div className="bg-white p-5 rounded-2xl border border-[#146B4A]/30 space-y-3 text-xs">
                      <div>
                        <label className="font-bold block mb-1">Customer Quote</label>
                        <textarea
                          rows={2}
                          value={editingTestimonial.quote}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold block mb-1">Client Tag</label>
                          <input
                            type="text"
                            value={editingTestimonial.clientType}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientType: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Location</label>
                          <input
                            type="text"
                            value={editingTestimonial.location || ''}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-[#F7F8F4]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pub_check"
                          checked={editingTestimonial.isPublished}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isPublished: e.target.checked })}
                        />
                        <label htmlFor="pub_check" className="font-bold">Published on website</label>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => { setEditingTestimonial(null); setIsAddingTestimonial(false); }} className="px-4 py-2 border rounded-lg">
                          Cancel
                        </button>
                        <button onClick={() => handleSaveTestimonial(editingTestimonial)} className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-lg">
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                      <div key={t.id} className="bg-white p-5 rounded-2xl border border-[#EAF4EE] flex flex-col justify-between">
                        <div>
                          <p className="text-sm italic font-medium text-[#0B3D2E] mb-3">"{t.quote}"</p>
                          <p className="text-xs font-bold text-[#146B4A]">— {t.clientType}</p>
                          {t.location && <p className="text-[11px] text-slate-500">{t.location}</p>}
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-3 border-t">
                          <span className={`text-xs ${t.isPublished ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                            {t.isPublished ? 'Published' : 'Hidden'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingTestimonial(t); setIsAddingTestimonial(false); }}
                              className="p-1.5 bg-slate-100 rounded-lg text-slate-700"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="p-1.5 bg-rose-50 rounded-lg text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: BRANDING, COLOURS & FONT TYPE */}
              {activeTab === 'branding' && settings && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Branding, Colors & Typography</h3>
                      <p className="text-xs text-slate-500">Customize the site color palette and typography family.</p>
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#146B4A] text-white text-xs font-bold rounded-xl"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Branding</span>
                    </button>
                  </div>

                  {saveStatus && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
                      {saveStatus}
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-6 text-xs">
                    {/* Font Type Selection */}
                    <div>
                      <label className="font-bold block mb-2 text-sm text-[#0B3D2E]">Font Type / Typography Family</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'Outfit', name: 'Outfit (Modern Agribusiness)' },
                          { id: 'Plus Jakarta Sans', name: 'Plus Jakarta (Clean Contemporary)' },
                          { id: 'Playfair Display', name: 'Playfair (Editorial Luxury)' },
                          { id: 'Inter', name: 'Inter (Technical Precise)' }
                        ].map(f => (
                          <div
                            key={f.id}
                            onClick={() => setSettings({ ...settings, fontFamily: f.id as any })}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              settings.fontFamily === f.id
                                ? 'border-[#146B4A] bg-[#EAF4EE] font-bold text-[#146B4A]'
                                : 'border-[#EAF4EE] hover:border-slate-300'
                            }`}
                          >
                            <Type className="w-4 h-4 mb-1" />
                            <p>{f.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="pt-4 border-t border-[#EAF4EE] grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="font-bold block mb-1">Primary Brand Green</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded-lg font-mono text-xs bg-[#F7F8F4]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Dark Forest Green</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.darkGreenColor}
                            onChange={(e) => setSettings({ ...settings, darkGreenColor: e.target.value })}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.darkGreenColor}
                            onChange={(e) => setSettings({ ...settings, darkGreenColor: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded-lg font-mono text-xs bg-[#F7F8F4]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Warm Gold Accent</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.goldColor}
                            onChange={(e) => setSettings({ ...settings, goldColor: e.target.value })}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.goldColor}
                            onChange={(e) => setSettings({ ...settings, goldColor: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded-lg font-mono text-xs bg-[#F7F8F4]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SOCIAL MEDIA ICONS & LINKS */}
              {activeTab === 'social' && settings && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Manage Social Media Icons & Links</h3>
                      <p className="text-xs text-slate-500">
                        Link your official social media pages, add new icons with custom URLs, toggle their display, or delete them. Active icons appear in the top header and footer.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddingSocial(!isAddingSocial)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Social Media Icon</span>
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Links</span>
                      </button>
                    </div>
                  </div>

                  {saveStatus && (
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{saveStatus}</span>
                    </div>
                  )}

                  {/* ADD NEW SOCIAL ICON FORM */}
                  {isAddingSocial && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#146B4A] shadow-md space-y-4 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[#EAF4EE] text-[#146B4A]">
                            <Plus className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-[#0B3D2E]">Add New Social Media Icon</h4>
                            <p className="text-[11px] text-slate-500">Select the platform and provide your profile or channel link.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsAddingSocial(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Platform Selector & Live Icon Preview */}
                        <div>
                          <label className="font-bold block text-slate-700 mb-1">Select Platform</label>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#146B4A] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <SocialIcon platform={newSocialLink.platform} className="w-5 h-5" />
                            </div>
                            <select
                              value={newSocialLink.platform}
                              onChange={(e) => {
                                const plat = e.target.value as SocialPlatform;
                                setNewSocialLink({
                                  ...newSocialLink,
                                  platform: plat,
                                  name: newSocialLink.name || (plat.charAt(0).toUpperCase() + plat.slice(1))
                                });
                              }}
                              className="w-full px-3 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-semibold"
                            >
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="tiktok">TikTok</option>
                              <option value="youtube">YouTube</option>
                              <option value="twitter">X / Twitter</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="telegram">Telegram</option>
                              <option value="threads">Threads</option>
                              <option value="pinterest">Pinterest</option>
                              <option value="website">Website / Link</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Display Name */}
                        <div>
                          <label className="font-bold block text-slate-700 mb-1">Display Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Lomstel Instagram"
                            value={newSocialLink.name}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs"
                          />
                        </div>

                        {/* URL / Link */}
                        <div>
                          <label className="font-bold block text-slate-700 mb-1">Link URL (Address) *</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newSocialLink.url}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                            className="w-full px-3.5 py-2.5 border rounded-xl bg-[#F7F8F4] text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newSocialLink.enabled}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, enabled: e.target.checked })}
                            className="w-4 h-4 text-[#146B4A] rounded border-slate-300 focus:ring-[#146B4A]"
                          />
                          <span className="font-semibold text-slate-700">Display and activate immediately on website</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingSocial(false)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddSocialLink}
                            className="flex items-center gap-1.5 px-5 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Icon to Website</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LIST OF SOCIAL MEDIA ICONS */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EAF4EE] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div>
                        <h4 className="font-bold text-sm text-[#0B3D2E]">Configured Social Media Profiles ({settings.socialLinks?.length || 0})</h4>
                        <p className="text-[11px] text-slate-500">Edit the direct links below or toggle visibility on/off.</p>
                      </div>
                      <span className="text-[11px] text-[#146B4A] font-bold bg-[#EAF4EE] px-2.5 py-1 rounded-lg">
                        {activeSocialLinksCount} Active on Site
                      </span>
                    </div>

                    {!settings.socialLinks || settings.socialLinks.length === 0 ? (
                      <div className="text-center py-10 space-y-3">
                        <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-sm text-[#0B3D2E]">No social media icons configured yet</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Click below to add your first social media link (Facebook, Instagram, WhatsApp, etc.).
                        </p>
                        <button
                          onClick={() => setIsAddingSocial(true)}
                          className="px-4 py-2 bg-[#146B4A] text-white font-bold rounded-xl text-xs"
                        >
                          Add Social Icon
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {settings.socialLinks.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              item.enabled 
                                ? 'bg-white border-[#EAF4EE] shadow-xs' 
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                          >
                            {/* Left: Platform Icon & Name & Dropdown */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                item.enabled ? 'bg-[#146B4A] text-white' : 'bg-slate-300 text-slate-600'
                              }`}>
                                <SocialIcon platform={item.platform} className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleUpdateSocialLink(item.id, { name: e.target.value })}
                                  placeholder="Platform Label"
                                  className="font-bold text-xs text-[#0B3D2E] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#146B4A] focus:outline-none w-full"
                                />
                                <select
                                  value={item.platform}
                                  onChange={(e) => handleUpdateSocialLink(item.id, { platform: e.target.value as SocialPlatform })}
                                  className="text-[11px] text-slate-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                                >
                                  <option value="facebook">Facebook</option>
                                  <option value="instagram">Instagram</option>
                                  <option value="whatsapp">WhatsApp</option>
                                  <option value="tiktok">TikTok</option>
                                  <option value="youtube">YouTube</option>
                                  <option value="twitter">X / Twitter</option>
                                  <option value="linkedin">LinkedIn</option>
                                  <option value="telegram">Telegram</option>
                                  <option value="threads">Threads</option>
                                  <option value="pinterest">Pinterest</option>
                                  <option value="website">Website / Link</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>

                            {/* Middle: URL Input Field */}
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Destination Web URL / Link
                              </label>
                              <input
                                type="url"
                                value={item.url}
                                onChange={(e) => handleUpdateSocialLink(item.id, { url: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                              />
                            </div>

                            {/* Right: Actions (Toggle, Test Link, Delete) */}
                            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                              {/* Enable / Disable Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleSocialLink(item.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                  item.enabled
                                    ? 'bg-[#EAF4EE] text-[#146B4A] hover:bg-[#d5e9dc]'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                              >
                                {item.enabled ? 'Active' : 'Disabled'}
                              </button>

                              {/* Test Link Button */}
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#F7F8F4] hover:bg-[#EAF4EE] text-slate-700 hover:text-[#146B4A] rounded-lg text-xs font-semibold border border-[#EAF4EE] transition-colors"
                                  title="Test link in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Test Link</span>
                                </a>
                              )}

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteSocialLink(item.id)}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Icon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 10: SUPABASE SETUP & COMPLETE SQL SCRIPT */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B3D2E] font-display">Supabase Integration & Database Schema</h3>
                    <p className="text-xs text-slate-500">
                      Production PostgreSQL script with Row Level Security (RLS) policies, indexes, and setup instructions.
                    </p>
                  </div>

                  {/* Status & Connection Details */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EAF4EE] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAF4EE]">
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-bold text-[#0B3D2E]">
                            {isSupabaseConfigured ? 'Supabase Database Connected' : 'Running in Local Reactive Store Mode'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {isSupabaseConfigured 
                              ? 'Cloud PostgreSQL synchronization active for orders, products, and site data.' 
                              : 'All operations are functional and saved locally in your browser.'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={testingConnection}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{testingConnection ? 'Testing Connection...' : 'Test Database Ping'}</span>
                      </button>
                    </div>

                    {/* Connection Test Result Banner */}
                    {connectionResult && (
                      <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 font-medium ${
                        connectionResult.success 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        {connectionResult.success ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{connectionResult.message}</span>
                      </div>
                    )}

                    {/* Active Credentials Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="p-3 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE]">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Project REST Endpoint / URL
                        </span>
                        <p className="font-mono text-xs text-[#0B3D2E] break-all font-semibold select-all">
                          {supabaseUrl || 'https://puxfokyknlnkgbcyvtui.supabase.co'}
                        </p>
                      </div>

                      <div className="p-3 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE]">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Anon Public API Key
                        </span>
                        <p className="font-mono text-xs text-[#0B3D2E] truncate font-semibold select-all">
                          {supabaseAnonKey ? `${supabaseAnonKey.slice(0, 24)}...${supabaseAnonKey.slice(-12)}` : 'Active'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SQL Schema Copy Block */}
                  <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-bold text-xs text-white">Full SQL Schema (schema.sql)</span>
                        <p className="text-[10px] text-slate-400">Copy and paste directly into Supabase SQL Editor</p>
                      </div>
                      <button
                        onClick={() => {
                          const sql = `-- ===================================================
-- LOMSTEL AGRO - FULL PRODUCTION SUPABASE SCHEMA
-- NAFDAC REG. NO: A8-121508L
-- ===================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  brand_name TEXT NOT NULL DEFAULT 'Lomstel Agro',
  tagline TEXT NOT NULL DEFAULT 'Growing for a Better Tomorrow.',
  nafdac_reg TEXT NOT NULL DEFAULT 'A8-121508L',
  primary_phone TEXT NOT NULL DEFAULT '+234 812 468 0837',
  secondary_phone TEXT NOT NULL DEFAULT '+234 806 543 0680',
  whatsapp_number TEXT NOT NULL DEFAULT '2348124680837',
  email TEXT NOT NULL DEFAULT 'lomstelsocial@gmail.com',
  main_website TEXT NOT NULL DEFAULT 'https://www.lomstel.com',
  mushroom_website TEXT NOT NULL DEFAULT 'https://lomstelmushroom.mobirisesite.com/',
  location_address TEXT NOT NULL DEFAULT '35, Ewuosho Street, off Aiyetoro Road, Kanuyi, Ogun State, Nigeria.',
  hero_headline TEXT NOT NULL DEFAULT 'FRESH OYSTER MUSHROOMS, GROWN WITH CARE.',
  hero_subheadline TEXT NOT NULL DEFAULT 'Discover fresh, natural and nutritious oyster mushrooms, carefully cultivated and hygienically packaged by Lomstel Agro.',
  hero_image TEXT,
  hero_dried_image TEXT,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  scrolling_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_section_headline TEXT DEFAULT 'WATCH OUR FARM IN ACTION',
  video_section_subheadline TEXT,
  videos JSONB NOT NULL DEFAULT '[]'::jsonb,
  about_title TEXT DEFAULT 'FROM OUR FARM TO YOUR TABLE.',
  about_text TEXT NOT NULL,
  about_image TEXT,
  benefits_headline TEXT DEFAULT 'GOOD FOOD STARTS WITH GOOD CHOICES.',
  benefits_subtext TEXT,
  facility_headline TEXT DEFAULT 'SEE WHERE YOUR MUSHROOMS COME FROM.',
  facility_subtext TEXT,
  facility_image TEXT,
  contact_headline TEXT DEFAULT 'GET IN TOUCH WITH LOMSTEL AGRO',
  primary_color TEXT NOT NULL DEFAULT '#146B4A',
  dark_green_color TEXT NOT NULL DEFAULT '#0B3D2E',
  gold_color TEXT NOT NULL DEFAULT '#D4A72C',
  font_family TEXT DEFAULT 'Outfit',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure video columns exist if table was previously created
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_headline TEXT DEFAULT 'WATCH OUR FARM IN ACTION';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_subheadline TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fresh', 'dried', 'wholesale')),
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  price_estimate TEXT,
  min_order TEXT,
  image TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  client_type TEXT NOT NULL,
  location TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'))
);

-- 7. VISITOR ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id TEXT PRIMARY KEY DEFAULT 'global_analytics',
  total_page_views INTEGER NOT NULL DEFAULT 1,
  unique_visitors INTEGER NOT NULL DEFAULT 1,
  total_orders INTEGER NOT NULL DEFAULT 0,
  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CUSTOMER LEADS & OUTREACH TABLE
CREATE TABLE IF NOT EXISTS public.customer_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  interest TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Inquiry',
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- ALLOW ANON & AUTHENTICATED ACCESS FOR THE APP
DROP POLICY IF EXISTS "Allow all on site_settings" ON public.site_settings;
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on products" ON public.products;
CREATE POLICY "Allow all on products" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on gallery" ON public.gallery;
CREATE POLICY "Allow all on gallery" ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on faqs" ON public.faqs;
CREATE POLICY "Allow all on faqs" ON public.faqs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on testimonials" ON public.testimonials;
CREATE POLICY "Allow all on testimonials" ON public.testimonials FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on site_analytics" ON public.site_analytics;
CREATE POLICY "Allow all on site_analytics" ON public.site_analytics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on customer_leads" ON public.customer_leads;
CREATE POLICY "Allow all on customer_leads" ON public.customer_leads FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- STORAGE BUCKET CREATION (FOR MEDIA UPLOADS)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lomstel-media', 'lomstel-media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
CREATE POLICY "Public media access" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'lomstel-media');

DROP POLICY IF EXISTS "Public media upload" ON storage.objects;
CREATE POLICY "Public media upload" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'lomstel-media');

DROP POLICY IF EXISTS "Public media update" ON storage.objects;
CREATE POLICY "Public media update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'lomstel-media');`;
                          navigator.clipboard.writeText(sql);
                          setSqlCopied(true);
                          setTimeout(() => setSqlCopied(false), 3000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                      >
                        {sqlCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{sqlCopied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                      </button>
                    </div>

                    <pre className="font-mono text-[11px] max-h-56 overflow-y-auto text-slate-300 leading-tight">
                      {`-- Ready to execute in Supabase SQL Editor
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New'
);`}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
