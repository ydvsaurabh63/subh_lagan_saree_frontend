import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi, reviewApi } from '../services/api.js';
import { formatPrice, calculateDiscount } from '../utils/formatters.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProduct(identifier);
        if (res.success && res.product) {
          setProduct(res.product);

          // Fetch related and reviews in parallel
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
    return <LoadingSpinner text="Fetching royal saree details..." />;
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <h2 className="font-serif text-2xl font-bold text-primary">Saree Not Found</h2>
        <p className="text-stone-500 text-xs mt-2 mb-6">The drape you are looking for is no longer available.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-md">
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
      toast.error('Please enter your review comment');
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
        // Refresh reviews
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 pt-4">
          {/* Left Column: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="uppercase tracking-widest font-semibold text-gold-dark">
                  {product.category?.name || 'Heritage Collection'}
                </span>
                <div className="flex items-center text-amber-500 font-semibold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{product.ratings || 4.8}</span>
                  <span className="text-stone-400 ml-1">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brandText leading-snug">
                {product.name}
              </h1>

              {/* SKU & Stock */}
              <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1.5">
                <span>SKU: <strong className="text-stone-700">{product.sku}</strong></span>
                <span>•</span>
                <span className="flex items-center text-emerald-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {product.stock > 0 ? 'In Stock (Ready to Dispatch)' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Area */}
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-sm flex items-baseline space-x-4">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-sans">
                {formatPrice(effectivePrice)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                    {discountLabel}
                  </span>
                </>
              )}
              <span className="text-xs text-stone-400 block ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Saree Specifications Card */}
            <div className="bg-cream/60 rounded-xl p-4 border border-gold/30 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-500">Fabric:</span>
                  <p className="font-semibold text-brandText">{product.fabric}</p>
                </div>
                <div>
                  <span className="text-stone-500">Color:</span>
                  <p className="font-semibold text-brandText">{product.color}</p>
                </div>
                <div>
                  <span className="text-stone-500">Saree Length:</span>
                  <p className="font-semibold text-brandText">{product.sareeLength || '5.5 Meters'}</p>
                </div>
                <div>
                  <span className="text-stone-500">Blouse Piece:</span>
                  <p className="font-semibold text-brandText">{product.blouseDetails || '0.8 Meters Included'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-500">Occasion:</span>
                  <p className="font-semibold text-brandText">{product.occasion}</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-medium text-stone-600">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-cream text-stone-600 transition"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-brandText">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-cream text-stone-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main CTAs: Add to Cart, Buy Now, Wishlist */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-6 bg-gold hover:bg-gold-light text-secondary-dark text-xs font-bold uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now (COD)</span>
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
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Delivery & Security Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center">
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <Truck className="w-4 h-4 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-brandText">Free Shipping</span>
                <span className="text-[10px] text-stone-400">On orders &gt; ₹1,999</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <ShieldCheck className="w-4 h-4 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-brandText">Cash On Delivery</span>
                <span className="text-[10px] text-stone-400">Pay at doorstep</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-stone-100">
                <RotateCcw className="w-4 h-4 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-brandText">7-Day Exchange</span>
                <span className="text-[10px] text-stone-400">Hassle-free guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-10 border-t border-stone-200">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Customer Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real experiences from patrons who draped this Subh Lagan saree.
                </p>
              </div>
            </div>

            {/* Add Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="bg-white p-5 rounded-2xl border border-gold/40 shadow-sm space-y-4">
                <h4 className="font-serif text-sm font-bold text-brandText">Share Your Experience</h4>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="text-amber-500 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= ratingInput ? 'fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Your Review</label>
                  <textarea
                    rows="3"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tell us about the fabric luster, zari craft, and compliments you received..."
                    required
                    className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-gold"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="bg-cream/60 p-4 rounded-xl border border-gold/30 text-center text-xs">
                <p className="text-stone-600">
                  Have you draped this saree?{' '}
                  <Link to="/login" className="font-bold text-primary underline">
                    Sign in to leave a verified review.
                  </Link>
                </p>
              </div>
            )}

            {/* Review Cards List */}
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 text-center py-6">
                Be the first to review this magnificent handcrafted saree!
              </p>
            )}
          </div>
        </div>

        {/* Related Sarees Grid */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-stone-200">
            <h3 className="font-serif text-2xl font-bold text-primary mb-8 text-center sm:text-left">
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
