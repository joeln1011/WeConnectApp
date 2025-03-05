import { default as Post } from "@components/Post";
import { useUserInfo } from "@hooks/index";
import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";

jest.mock("@hooks/index", () => ({
  useUserInfo: jest.fn(),
}));

beforeEach(() => {
  useUserInfo.mockReturnValue({ fullName: "Test User" });
});

describe("Post component", () => {
  test("renders the post content correctly", () => {
    const { getByText } = render(
      <Post
        fullName="Tung HoleTex"
        content="Hello World"
        createdAt={Date.now()}
      />,
    );

    expect(getByText("Tung HoleTex")).toBeInTheDocument();
  });

  test("displays the correct number of likes", () => {
    const likes = [1, 2, 4];
    const { getByText } = render(
      <Post
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        likes={likes}
      />,
    );

    expect(getByText("3")).toBeInTheDocument();
  });

  test("calls onLike with id when Like button is clicked", () => {
    const mockOnLike = jest.fn();

    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        onLike={mockOnLike}
      />,
    );

    const likeButton = screen.getByText("Like");
    fireEvent.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledWith("joelngiuyen");
  });

  test("renders an image when image prop is available", () => {
    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        image="http://example.com/image.jpg"
      />,
    );

    const imageElm = screen.getByRole("img");
    expect(imageElm).toBeInTheDocument();
    expect(imageElm).toHaveAttribute("src", "http://example.com/image.jpg");
  });

  // render so luong comments
  test("renders correct number of comments", () => {
    const comments = [
      {
        _id: "1",
        comment: "First comment",
        createdAt: dayjs().toISOString(),
        author: { _id: "a1", fullName: "John Doe" },
      },
      {
        _id: "2",
        comment: "Second comment",
        createdAt: dayjs().toISOString(),
        author: { _id: "a2", fullName: "Jane Doe" },
      },
    ];

    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        comments={comments}
      />,
    );

    expect(screen.getByText("2 comments")).toBeInTheDocument();
  });

  test("toggles comment box when Comment button is clicked", () => {
    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        comments={[]}
      />,
    );

    expect(screen.queryByPlaceholderText("Comment...")).toBeNull();

    const commentBtn = screen.getByText("Comment");
    fireEvent.click(commentBtn);

    expect(screen.queryByPlaceholderText("Comment...")).toBeInTheDocument();
  });

  test("calls onComment callback when sending a comment", () => {
    const mockOnComment = jest.fn();

    render(
      <Post
        id="joelnguyen"
        fullName="Joel Nguyen"
        content="Hello World"
        createdAt={Date.now()}
        comments={[]}
        onComment={mockOnComment}
      />,
    );

    const commentBtn = screen.getByText("Comment");
    fireEvent.click(commentBtn);

    const commentInput = screen.getByPlaceholderText("Comment...");
    fireEvent.change(commentInput, { target: { value: "Hello World" } });

    const sendBtn = screen.getByTestId("send-comment");
    fireEvent.click(sendBtn);

    expect(mockOnComment).toHaveBeenCalledWith({
      comment: "Hello World",
      postId: "joelnguyen",
    });
  });
});
