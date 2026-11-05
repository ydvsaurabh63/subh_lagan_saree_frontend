import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi, reviewApi } from '../services/api.js';
import { formatPrice, calculateDiscount } from '../utils/formatters.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTryOn } from '../context/TryOnContext.jsx';

import ProductGallery from '../components/product/ProductGallery.jsx';
import ReviewCard from '../components/product/ReviewCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  Send,
  Scissors,
  Palette,
  Award,
  Calendar,
  Shirt,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { tryOnProduct } = useTryOn();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProduct(identifier);
        if (res.success && res.product) {
          setProduct(res.product);

          const [relRes, revRes] = await Promise.all([
            productApi.getRelated(res.product._id),
            reviewApi.getProductReviews(res.product._id),
          ]);
          if (relRes.success) setRelated(relRes.products || []);
          if (revRes.success) setReviews(revRes.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  if (loading) {
    return <LoadingSpinner text="Fetching saree details..." />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-2xl font-bold text-primary">Saree Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-primary text-white text-xs font-semibold rounded-md">
          Browse All Sarees
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;
  const discountLabel = calculateDiscount(product.price, product.discountPrice);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error('Please enter your review');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await reviewApi.createReview({
        productId: product._id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      if (res.success) {
        toast.success(res.message);
        setCommentInput('');
        const revRes = await reviewApi.getProductReviews(product._id);
        if (revRes.success) setReviews(revRes.reviews || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb
          items={[
            { label: 'Shop', link: '/shop' },
            { label: product.category?.name || 'Sarees', link: `/shop?category=${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-3">
          {/* Left Column: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="space-y-5">
            <div>
              {/* Category, Rating & SKU */}
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="uppercase tracking-widest font-bold text-gold-dark text-[11px]">
                  {product.category?.name || 'Collection'}
                </span>
                <div className="flex items-center text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{product.ratings || 4.8}</span>
                  <span className="text-stone-400 font-normal ml-1">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brandText leading-snug">
                {product.name}
              </h1>

              {/* Stock Status Badge */}
              <div className="flex items-center space-x-3 text-xs text-stone-500 mt-2">
                <span className="font-mono text-stone-600">SKU: {product.sku}</span>
                <span>•</span>
                <span className="flex items-center text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {product.stock > 0 ? 'Ready to Dispatch' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Area */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-sm flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-sans">
                {formatPrice(effectivePrice)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through font-sans">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                    {discountLabel}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Visual Specs Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <Sparkles className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">Fabric</span>
                <strong className="text-[11px] text-brandText truncate w-full">{product.fabric}</strong>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <Palette className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">Color</span>
                <strong className="text-[11px] text-brandText truncate w-full">{product.color}</strong>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <Award className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">Length</span>
                <strong className="text-[11px] text-brandText truncate w-full">{product.sareeLength || '5.5 M'}</strong>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <Scissors className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">Blouse</span>
                <strong className="text-[11px] text-brandText truncate w-full">Included (0.8M)</strong>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-stone-600">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 hover:bg-cream text-stone-600"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-brandText">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 hover:bg-cream text-stone-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Buy Now (COD)</span>
                </button>

                <button
                  onClick={() => tryOnProduct(product)}
                  className="py-3 px-4 bg-[#18181b] hover:bg-[#27272a] text-white border-2 border-[#D97706] text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-1.5"
                  title="Try this Saree in AI Fitting Room"
                >
                  <Shirt className="w-4 h-4 text-[#F59E0B]" />
                  <span>Try It On</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border transition flex items-center justify-center ${
                    inWishlist
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-stone-300 text-stone-600 hover:text-primary hover:border-gold'
                  }`}
                  title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span className="sm:hidden text-xs font-semibold ml-2">
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>
              </div>
            </div>

            {/* Visual Trust Pillars with Icons */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-200 text-center">
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <Truck className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] font-bold text-brandText">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <ShieldCheck className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] font-bold text-brandText">Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <RotateCcw className="w-4 h-4 text-gold mb-1" />
                <span className="text-[10px] font-bold text-brandText">7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="font-serif text-xl font-bold text-primary text-center">
              Customer Reviews ({reviews.length})
            </h3>

            {/* Review form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-xl border border-gold/40 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brandText">Your Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="text-amber-500"
                      >
                        <Star className={`w-4 h-4 ${star <= ratingInput ? 'fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows="2"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your experience with this saree..."
                  required
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-gold"
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1"
                >
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <p className="text-xs text-center text-stone-500">
                <Link to="/login" className="text-primary font-bold underline">
                  Sign in
                </Link>{' '}
                to leave a verified review.
              </p>
            )}

            {/* Review Cards */}
            <div className="space-y-2.5">
              {reviews.map((rev) => (
                <ReviewCard key={rev._id} review={rev} />
              ))}
            </div>
          </div>
        </div>

        {/* Related Sarees Grid */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-stone-200">
            <h3 className="font-serif text-xl font-bold text-primary mb-6">
              You May Also Adore
            </h3>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
