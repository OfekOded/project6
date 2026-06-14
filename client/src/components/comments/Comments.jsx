import useComments from '../../hooks/useComments';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import '../../styles/Comments.css';

export default function Comments({ postId, currentUser }) {
  const { comments, loading, error, addComment, saveComment, deleteComment } = useComments(postId, currentUser);

  return (
    <div className="comments-box">
      {loading && <p className="muted">Loading comments...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && comments.length === 0 && <p className="muted">No comments yet.</p>}

      <ul className="comment-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onSave={saveComment}
            onDelete={deleteComment}
          />
        ))}
      </ul>

      <CommentForm onAdd={addComment} />
    </div>
  );
}
